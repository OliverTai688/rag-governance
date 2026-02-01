/**
 * RAG 檢索工具
 * 基於關鍵字的 Top-K 檢索
 */

import { DocumentChunk } from './chunking';
import { tokenize, calculateKeywordScore } from './tokenizer';

export type ScoredChunk = {
    chunk: DocumentChunk;
    score: number;
};

/**
 * 檢索 Top-K 相關段落
 * 
 * @param query 使用者問題
 * @param chunks 所有文件段落
 * @param k Top-K 數量（預設 5）
 * @param threshold 最低信心分數（預設 0.1）
 * @returns 相關段落（按分數排序）
 */
export function retrieveTopK(
    query: string,
    chunks: DocumentChunk[],
    k: number = 5,
    threshold: number = 0.05 // 降低門檻，讓更多潛在相關的內容被送入 LLM
): DocumentChunk[] {
    if (!query || chunks.length === 0) return [];

    // 1. 將查詢分詞
    const queryKeywords = tokenize(query);

    if (queryKeywords.length === 0) return [];

    // 2. 計算每個 chunk 的相似度分數
    const scoredChunks: ScoredChunk[] = chunks.map(chunk => ({
        chunk,
        score: calculateKeywordScore(queryKeywords, chunk.keywords),
    }));

    // 3. 過濾低於閾值的結果
    const filteredChunks = scoredChunks.filter(sc => sc.score >= threshold);

    // 4. 按分數降序排序
    filteredChunks.sort((a, b) => b.score - a.score);

    const results = filteredChunks.slice(0, k).map(sc => sc.chunk);

    console.log(`[Retrieval] Query: "${query}" | Found: ${filteredChunks.length} | Top-1 Score: ${filteredChunks[0]?.score || 0}`);

    return results;
}

/**
 * 檢索指定文件中的 Top-K 段落
 */
export function retrieveTopKFromDocument(
    query: string,
    chunks: DocumentChunk[],
    documentId: string,
    k: number = 5
): DocumentChunk[] {
    const documentChunks = chunks.filter(c => c.documentId === documentId);
    return retrieveTopK(query, documentChunks, k);
}
