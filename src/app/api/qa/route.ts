import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { DocumentChunk } from '@/lib/rag';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type Citation = {
    paragraphId: string;
    relevance: string;
};

export type QAResponse = {
    answer: string;
    citations: Citation[];
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { question, chunks, history } = body as {
            question: string;
            chunks: DocumentChunk[];
            history?: { role: 'user' | 'ai'; content: string }[];
        };

        // 驗證輸入
        if (!question || !question.trim()) {
            return NextResponse.json(
                {
                    answer: '請輸入問題。',
                    citations: [],
                } as QAResponse,
                { status: 400 }
            );
        }

        if (!chunks || chunks.length === 0) {
            return NextResponse.json({
                answer: '文件中未找到可支持的內容。',
                citations: [],
            } as QAResponse);
        }

        // 檢查 API key
        if (!process.env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY 未設定');
            return NextResponse.json(
                {
                    answer: '系統設定錯誤，請稍後再試。',
                    citations: [],
                } as QAResponse,
                { status: 500 }
            );
        }

        // 建構 prompt
        const systemPrompt = buildSystemPrompt();
        const userPrompt = buildUserPrompt(question, chunks, history);

        // 呼叫 OpenAI API
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.1,
            max_tokens: 1000,
        });

        // 解析回應
        const responseContent = completion.choices[0].message.content;

        console.log(`[QA API] Question: "${question}"`);
        console.log(`[QA API] Chunks provided: ${chunks.length}`);
        console.log(`[QA API] Raw response from OpenAI:`, responseContent);

        if (!responseContent) {
            return NextResponse.json({
                answer: '文件中未找到可支持的內容。',
                citations: [],
            } as QAResponse);
        }

        const parsed = JSON.parse(responseContent) as QAResponse;

        // 驗證 citations 中的 paragraphId 是否存在於 chunks
        const validParagraphIds = new Set(chunks.map(c => c.paragraphId));
        const validatedCitations = parsed.citations.filter(cit =>
            validParagraphIds.has(cit.paragraphId)
        );

        console.log(`[QA API] Answer: "${parsed.answer}"`);
        console.log(`[QA API] Citations count: ${validatedCitations.length}`);

        return NextResponse.json({
            answer: parsed.answer,
            citations: validatedCitations,
        } as QAResponse);

    } catch (error: any) {
        console.error('OpenAI API 錯誤:', error);

        // 處理常見錯誤
        if (error?.status === 401) {
            return NextResponse.json(
                {
                    answer: 'API 金鑰無效，請聯絡管理員。',
                    citations: [],
                } as QAResponse,
                { status: 500 }
            );
        }

        if (error?.status === 429) {
            return NextResponse.json(
                {
                    answer: 'API 請求額度已用盡，請稍後再試。',
                    citations: [],
                } as QAResponse,
                { status: 429 }
            );
        }

        return NextResponse.json(
            {
                answer: '系統錯誤，請稍後再試。',
                citations: [],
            } as QAResponse,
            { status: 500 }
        );
    }
}

/**
 * 建構 System Prompt
 */
function buildSystemPrompt(): string {
    return `你是一個專業的顧問 (Digital Governance Advisor)。
你的任務是協助客戶理解文件內容，並根據提供的資料給予專業、擬人化且可信的建議。

核心方針：
1. 展現顧問的專業感與溫度。你的語氣應該像是在面對面與客戶交談。
2. 嚴格遵守根據文件回答的原則。若文件中完全未提及，請禮貌地告知客戶目前資料尚未涵蓋此部分，而不是生硬地回報錯誤。
3. 為你的每一段關鍵回答標註引用來源。引用的目的在於讓客戶知道你的建議是有據可查的，而不是生冷的「證據」。
4. 結構化你的答案，使其易於閱讀。強烈建議使用 Markdown 格式（如條列清單、粗體關鍵字、甚至表格）來呈現複雜資訊。
5. 使用繁體中文回答。

6. 解讀優先權：
   - 當問題涉及「費用」、「價格」或「成本」時，優先解讀「專案導入費用」、「維護方案費用」等核心業務資訊。
   - 除非使用者明確詢問「Token」或「AI 用量」，否則不要主動將 Token 費用作為主要的費用說明，僅能作為補充資訊。
   - 優先引用來自「提案 (Proposal)」或「章程 (Charter)」等核心文件的內容，技術細節文件次之。

回應格式（必須為 JSON）：
{
  "answer": "顧問的完整回答內容（例如：您好！關於這點，根據專案規程的規劃...）",
  "citations": [
    {
      "paragraphId": "引用段落的 ID",
      "relevance": "為什麼這一段對客戶的問題很重要"
    }
  ]
}

如果完全無法從段落中得出答案，請回傳：
{
  "answer": "很抱歉，根據目前提供的手冊或文件，我暫時找不到關於這一點的具體紀錄。建議您可以聯繫專案團隊進一步確認，或嘗試詢問其他與流程相關的問題。",
  "citations": []
}`;
}

/**
 * 建構 User Prompt
 */
/**
 * 建構 User Prompt
 */
function buildUserPrompt(question: string, chunks: DocumentChunk[], history?: { role: 'user' | 'ai'; content: string }[]): string {
    const chunksContext = chunks
        .map(
            (chunk, i) => `
[段落 ${i + 1}]
文件：${chunk.documentTitle}
段落 ID：${chunk.paragraphId}
章節：${chunk.sectionTitle || '無'}
內容：
${chunk.content}
`
        )
        .join('\n---\n');

    let historyContext = '';
    if (history && history.length > 0) {
        // 取最近 6 則訊息作為上下文（避免過長）
        const recentHistory = history.slice(-6);
        historyContext = `
以下是您與使用者的近期對話紀錄（供理解上下文使用）：
${recentHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Advisor'}: ${msg.content}`).join('\n')}
---
`;
    }

    return `
${historyContext}

問題：${question}

文件段落：
${chunksContext}

請根據上述段落回答問題。請參考對話歷史來理解使用者的代名詞（如「前者」、「這個方案」）所指涉的對象，但回答必須基於文件段落的事實。若段落中無相關內容，請明確回覆「文件中未找到可支持的內容。」並回傳空的 citations 陣列。`;
}

