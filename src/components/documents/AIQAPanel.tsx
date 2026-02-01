/**
 * AI Q&A Panel Component
 * 問答介面，顯示對話history + 引用卡片
 */

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocumentChunk } from '@/lib/rag';
import { CitationCard } from './CitationCard';
import type { QAResponse, Citation } from '@/app/api/qa/route';

type Message = {
    role: 'user' | 'ai';
    content: string;
    citations?: Citation[];
    citationChunks?: DocumentChunk[];
};

type AIQAPanelProps = {
    onAskQuestion: (question: string, history?: { role: 'user' | 'ai'; content: string }[], overrideChunks?: DocumentChunk[]) => Promise<QAResponse>;
    allChunks: DocumentChunk[];
    onJumpToParagraph: (paragraphId: string) => void;
    disabled?: boolean;
};

const SUGGESTED_QUESTIONS = [
    '專案的主要目標是什麼？',
    '三個導入方案的差異與費用？',
    '專案分組哪些階段推進？',
];

export function AIQAPanel({
    onAskQuestion,
    allChunks,
    onJumpToParagraph,
    disabled = false,
}: AIQAPanelProps) {
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: '您好！我是您的顧問。很高興能協助您。您可以詢問關於專案規程、導入方案或流程細節的任何問題，我會根據現有的文件資料為您提供分析與建議。',
            citations: [],
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 自動捲動到底部
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const [isTouring, setIsTouring] = useState(false);

    const handleStartTour = async () => {
        setIsTouring(true);
        // 清空現有對話，開始導讀
        setMessages([
            {
                role: 'ai',
                content: '好的，我也將切換至**顧問導讀模式**。請稍候，我這就為您整理這份專案文件的重點精華...',
                citations: [],
            },
        ]);

        const TOUR_PROMPT = "請以專案顧問的身份，為我進行這份「正式提案」的完整導讀。請綜合參照專案章程 (Charter)、方案提案 (Proposal) 與導入時程 (Roadmap)，但請**特別著重於「方案提案 (Proposal)」中的三個導入方案**：1. 基礎節奏導入、2. 成長優化導入、3. 轉型自動化導入。請說明這三個方案的差異、適用的組織階段，以及各自的預期效益。請由上而下，先簡述專案背景 (Charter)，接著深入分析上述三個方案的選擇 (Proposal)，最後補充預計的執行時程 (Roadmap)。請用專業但口語化的方式解說，協助我做出最合適的方案選擇。";

        // 手動挑選重點段落 (Charter, Proposal, Roadmap 的前段部分與方案細節)
        // 這裡我們簡單地選取每個文件的前 5 個段落，以及包含「方案」關鍵字的段落
        const tourChunks = allChunks.filter(chunk => {
            const isIntro = chunk.paragraphIndex < 3; // 每個文件的前 3 段
            const isPlan = chunk.content.includes('方案') || chunk.content.includes('導入') || chunk.content.includes('費用');
            return isIntro || isPlan;
        });

        // 限制數量以免爆掉 token (取前 15 個最相關的)
        // 這裡我們其實已經做了簡單篩選，只需確保不要太多
        const selectedTourChunks = tourChunks.slice(0, 20);

        await handleSendMessage(TOUR_PROMPT, selectedTourChunks);
    };

    const handleEndTour = () => {
        setIsTouring(false);
        setMessages([{
            role: 'ai',
            content: '導讀模式已結束。您可以繼續針對特定細節提問，或選擇其他的操作。',
            citations: [],
        }]);
    };

    const handleSendMessage = async (customQuestion?: string, overrideChunks?: DocumentChunk[]) => {
        const question = (customQuestion || chatInput).trim();
        if (!question || isLoading) return;

        // 加入使用者訊息 (若是導讀模式的自動觸發，則不顯示 User 訊息，保持沉浸感)
        const isTourTrigger = question === "請以專案顧問的身份，為我進行這份「正式提案」的完整導讀。請綜合參照專案章程 (Charter)、方案提案 (Proposal) 與導入時程 (Roadmap)，但請**特別著重於「方案提案 (Proposal)」中的三個導入方案**：1. 基礎節奏導入、2. 成長優化導入、3. 轉型自動化導入。請說明這三個方案的差異、適用的組織階段，以及各自的預期效益。請由上而下，先簡述專案背景 (Charter)，接著深入分析上述三個方案的選擇 (Proposal)，最後補充預計的執行時程 (Roadmap)。請用專業但口語化的方式解說，協助我做出最合適的方案選擇。";

        if (!isTourTrigger) {
            const newUserMessage: Message = { role: 'user', content: question };
            setMessages(prev => [...prev, newUserMessage]);
        }

        setChatInput('');
        setIsLoading(true);

        try {
            // 呼叫 API
            // 格式化歷史紀錄，排除最後一則尚未加入的 user message（如果是由 UI 樂觀更新加入的話，但這裡是先 setMessages 再呼叫 API，所以...）
            // 其實可以直接傳入當前的 messages 狀態，因為它是上一次 render 的狀態，不包含剛加入的 user message？
            // 不，我们在 handleSendMessage 開頭就已經 setMessages 了。
            // 由於 React state update 是非同步的，此時的 messages 變數可能還沒包含最新的 user message (newUserMessage)。
            // 但我們需要把最新的 context 也考慮進去嗎？
            // 根據 React 運作，此時 `messages` 是舊的。`handleSendMessage` 內的 `setMessages` 排程了更新。
            // 我們應該手動構建包含 `newUserMessage` 的 history。

            const history = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            // 如果不是 tour trigger (即是明確的 user question)，我們剛剛在上面 setMessages 加入了 newUserMessage
            // 但因為 closure，這裡的 messages 是舊的。所以我們需要手動 append newUserMessage。
            if (!isTourTrigger && question) {
                history.push({ role: 'user', content: question });
            }

            const response = await onAskQuestion(question, history, overrideChunks);

            // 找出對應的 chunks（用於顯示完整資訊）
            // 注意：這裡只會顯示有被引用到的 chunks
            const citationChunks = response.citations
                .map(cit => allChunks.find(c => c.paragraphId === cit.paragraphId))
                .filter((c): c is DocumentChunk => c !== undefined);

            // 加入 AI 回應
            const aiMessage: Message = {
                role: 'ai',
                content: response.answer,
                citations: response.citations,
                citationChunks,
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('問答錯誤：', error);
            const errorMessage: Message = {
                role: 'ai',
                content: '系統發生錯誤，目前暫時無法回答，請稍後再試。',
                citations: [],
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Conversation */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 scroll-smooth"
            >
                {messages.map((msg, i) => {
                    const isUser = msg.role === 'user';
                    const citations = msg.citations ?? [];
                    const citationChunks = msg.citationChunks ?? [];

                    return (
                        <div key={i} className="space-y-3 animate-in fade-in duration-300">
                            {/* Header */}
                            <div className="flex items-center justify-between px-1">
                                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                    {isUser ? 'User Inquiry' : (isTouring ? 'Advisor Tour' : 'Advisor Insight')}
                                </p>
                                {!isUser && citations.length > 0 && (
                                    <p className="text-xs text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">
                                        引用了 {citations.length} 段來源
                                    </p>
                                )}
                            </div>

                            {/* Body */}
                            <div
                                className={`rounded-2xl p-3 lg:p-4 text-sm leading-relaxed shadow-sm ${isUser
                                    ? 'bg-slate-900 text-white ml-4 lg:ml-8 rounded-tr-none'
                                    : (isTouring && i === messages.length - 1 ? 'bg-indigo-50 border-indigo-100 text-slate-800' : 'bg-white text-slate-800') + ' mr-4 lg:mr-8 border border-slate-200 rounded-tl-none prose prose-sm prose-slate max-w-none'
                                    }`}
                            >
                                <div className="overflow-x-auto overflow-y-hidden">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({ node, ...props }) => (
                                                <div className="my-4 overflow-x-auto rounded-lg border border-slate-100 shadow-sm">
                                                    <table className="min-w-full divide-y divide-slate-200" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => <thead className="bg-slate-50" {...props} />,
                                            th: ({ node, ...props }) => <th className="px-3 py-2 text-left text-xs font-semibold text-slate-900 uppercase tracking-wider" {...props} />,
                                            td: ({ node, ...props }) => <td className="px-3 py-2 text-xs text-slate-600 whitespace-nowrap" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Citations */}
                            {!isUser && citationChunks.length > 0 && (
                                <div className="space-y-2 mt-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-px flex-1 bg-slate-200" />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sources</p>
                                        <div className="h-px flex-1 bg-slate-200" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        {citationChunks.map((chunk, j) => (
                                            <CitationCard
                                                key={j}
                                                chunk={chunk}
                                                onJumpToParagraph={onJumpToParagraph}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Suggested Questions & Tour Button */}
                {messages.length < 4 && !isLoading && !isTouring && (
                    <div className="space-y-3 pt-4">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">您可以試著問：</p>
                            <button
                                onClick={handleStartTour}
                                className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                快速導讀
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSendMessage(q)}
                                    className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all text-left shadow-sm active:scale-95"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex items-center gap-3 text-sm text-slate-500 bg-white border border-slate-200 p-4 rounded-xl shadow-sm mr-8 rounded-tl-none animate-pulse">
                        <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                        <span className="text-xs font-medium">
                            {isTouring ? '顧問整理中...' : '分析文件中...'}
                        </span>
                    </div>
                )}
            </div>

            {/* Input Overlay */}
            <div className="p-3 lg:p-6 border-t border-slate-200 bg-white relative z-10 pb-safe">
                {isTouring && (
                    <div className="absolute top-0 right-6 -translate-y-1/2">
                        <button
                            onClick={handleEndTour}
                            className="bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 text-xs px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 transition-all"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            結束導讀
                        </button>
                    </div>
                )}

                <div className="relative group">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder={isTouring ? "您可以隨時打斷顧問進行提問..." : "輸入您的問題..."}
                        disabled={disabled || isLoading}
                        className={`w-full pl-4 pr-12 py-3.5 border rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all shadow-sm ${isTouring
                            ? 'border-indigo-200 focus:ring-indigo-100 focus:border-indigo-400 bg-indigo-50/30'
                            : 'border-slate-200 focus:ring-slate-900/10 focus:border-slate-900'
                            } disabled:bg-slate-50 disabled:text-slate-400`}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={disabled || isLoading || !chatInput.trim()}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-95 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed group-focus-within:shadow-md"
                        aria-label="送出"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                        </svg>
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">
                    {isTouring ? '顧問導讀模式：AI 將主動解說，您可隨時提問或結束。' : '您的提問與回覆僅基於當前所選文件進行分析與引用。'}
                </p>
            </div>
        </div>
    );
}
