/**
 * QA Panel Component
 * 
 * 右側問答面板（整合版）
 * 包含 Header + AIQAPanel + Collapse Button
 */

import { DocumentChunk } from '@/lib/rag';
import { AIQAPanel } from '@/components/documents/AIQAPanel';
import { useQAService } from '@/hooks/useQAService';

type Props = {
    allChunks: DocumentChunk[];
    onJumpToParagraph: (paragraphId: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
    width?: number;
};

export function QAPanel({ allChunks, onJumpToParagraph, collapsed, onToggleCollapse, width = 420 }: Props) {
    const { askQuestion } = useQAService(allChunks);

    if (collapsed) {
        return (
            <aside
                className="hidden lg:flex w-12 border-l border-slate-200 flex-col bg-white transition-all duration-300"
            >
                <div className="flex flex-col items-center py-4 gap-3">
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 hover:bg-slate-100 rounded transition-colors"
                        title="展開"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside
            className="hidden lg:flex border-l border-slate-200 flex-col bg-white overflow-hidden"
            style={{ width: `${width}px` }}
        >
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-slate-900 text-base truncate">文件引用問答</h2>
                    <p className="text-xs text-slate-500 mt-2">
                        回答將以文件段落作為引用依據
                    </p>
                </div>
                <button
                    onClick={onToggleCollapse}
                    className="p-1 hover:bg-slate-100 rounded transition-colors shrink-0 ml-2"
                    title="收合"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* AI QA Panel */}
            <div className="flex-1 min-h-0">
                <AIQAPanel
                    onAskQuestion={askQuestion}
                    allChunks={allChunks}
                    onJumpToParagraph={onJumpToParagraph}
                />
            </div>
        </aside>
    );
}
