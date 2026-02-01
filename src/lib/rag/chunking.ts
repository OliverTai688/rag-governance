/**
 * 文件切段工具
 * 將 Markdown 文件切分為段落級別的 chunks
 */

import { tokenize } from './tokenizer';

export type DocumentChunk = {
    documentId: string;
    documentTitle: string;
    paragraphId: string;       // 穩定的段落 ID，例如 "doc-charter-p3"
    paragraphIndex: number;     // 段落索引（從 0 開始）
    sectionTitle?: string;      // 所屬章節標題
    content: string;            // 段落原文
    keywords: string[];         // 關鍵字（用於檢索）
};

/**
 * 將 Markdown 文件切分為段落
 * 
 * 規則：
 * - 以空行分段
 * - 排除純空白段落
 * - 段落最少 20 字元
 * - 保留最近的 heading 作為 sectionTitle
 */
export function chunkDocument(
    documentId: string,
    documentTitle: string,
    markdownContent: string
): DocumentChunk[] {
    if (!markdownContent) return [];

    const chunks: DocumentChunk[] = [];
    const lines = markdownContent.split('\n');

    let currentParagraph: string[] = [];
    let currentSectionTitle: string | undefined = undefined;
    let paragraphIndex = 0;

    const flushParagraph = () => {
        if (currentParagraph.length === 0) return;

        const content = currentParagraph.join('\n').trim();

        // 過濾過短段落（少於 10 字元）
        if (content.length < 10) {
            currentParagraph = [];
            return;
        }

        // 檢查是否為標題行
        const headingMatch = content.match(/^#{1,6}\s+(.+?)$/);
        if (headingMatch) {
            // 更新當前章節標題
            currentSectionTitle = headingMatch[1].trim();

            // 重要修改：將標題保留在內容中，以便前端渲染
            // 如果當前段落有內容，先 flush 掉作為上一段
            // 然後將標題作為新段落的開始
            if (currentParagraph.length > 0) {
                // 這裡的邏輯需要調整：content 變數已經是 currentParagraph join 的結果
                // 但我們在上方已經呼叫過 content = currentParagraph.join...
                // 這裡的結構有點怪，因為 content 是單次 flush 的內容
                // 原本的邏輯是：遇到標題 -> 視為上一段的結束（如果上一段是空的那也沒差），並更新 state
                // 但標題本身沒有被加入任何 chunk
            }

            // 新邏輯：
            // 標題行應該自己獨立成一個 chunk，或者作為下一段的開始？
            // 為了視覺效果，讓標題獨立成一個 chunk 是最安全的

            // 1. 先把剛剛積累的內容（除了這行標題...等等，content 是 currentParagraph.join）
            // 這裡 detect 的是 content 本身是一行...
            // 不對，flushParagraph 是在 "累積了一堆 lines" 之後呼叫的嗎？
            // 看 line 87: 空行才呼叫 flushParagraph。
            // 也就是說 currentParagraph 是一個段落的 lines。
            // 如果這個段落裡包含標題... Markdown 通常標題前後會有空行。
            // 如果 content 匹配到 header，表示這整個 block 就是一個 header。

            // 所以，我們應該把這個 header 作為一個 chunk 存起來。

            // 但原本的 return 導致它被跳過了。
            // 我們應該移除 return，讓它繼續往下走，被 push 到 chunks。

            // 但我們同時要更新 currentSectionTitle 給 *後續* 的 chunks 使用。
            // 所以保留 currentSectionTitle 更新，但**不**清空 currentParagraph，**不** return。

            // 不過 wait，如果 content 是 "## Title"，原本邏輯：
            // 1. update section title
            // 2. clear paragraph
            // 3. return (so nothing pushed to chunks)

            // 修改後：
            // 1. update section title
            // 2. 不要 return，繼續往下執行 -> Pushed to chunks

        }

        // 生成穩定的段落 ID
        const paragraphId = generateParagraphId(documentId, paragraphIndex);

        // 提取關鍵字
        const keywords = tokenize(content);

        chunks.push({
            documentId,
            documentTitle,
            paragraphId,
            paragraphIndex,
            sectionTitle: currentSectionTitle,
            content,
            keywords,
        });

        paragraphIndex++;
        currentParagraph = [];
    };

    // 逐行處理
    for (const line of lines) {
        const trimmedLine = line.trim();

        // 空行表示段落結束
        if (trimmedLine === '') {
            flushParagraph();
            continue;
        }

        currentParagraph.push(line);
    }

    // 處理最後一個段落
    flushParagraph();

    return chunks;
}

/**
 * 生成穩定的段落 ID
 * 
 * 格式：{documentId}-p{index}
 * 例如：doc-charter-p0, doc-charter-p1
 */
function generateParagraphId(documentId: string, index: number): string {
    return `${documentId}-p${index}`;
}

/**
 * 從段落 ID 解析文件 ID
 */
export function parseDocumentIdFromParagraphId(paragraphId: string): string | null {
    const match = paragraphId.match(/^(.+?)-p\d+$/);
    return match ? match[1] : null;
}
