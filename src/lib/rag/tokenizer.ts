/**
 * 分詞工具
 * 用於關鍵字檢索的文本分詞
 */

/**
 * 將文本分詞為關鍵字陣列
 * 保留中英文，過濾標點符號和過短詞彙
 */
export function tokenize(text: string): string[] {
    if (!text) return [];

    // 1. 基本清理
    const cleanText = text.toLowerCase().replace(/[^\w\s\u4e00-\u9fff]/g, ' ');

    // 2. 處理英文單字（以空白分割）
    const englishWords = cleanText.split(/\s+/).filter(w => /^[a-z0-9]+$/i.test(w) && w.length >= 2);

    // 3. 處理中文字（每個字都視為一個 token，這對中文檢索最精準）
    const chineseChars = cleanText.match(/[\u4e00-\u9fff]/g) || [];

    // 4. 處理中文詞彙（從空白分割得到的）
    const wordsFromSpaces = cleanText.split(/\s+/).filter(w => /[\u4e00-\u9fff]/.test(w) && w.length >= 2);

    // 合併所有 tokens 並去重
    return Array.from(new Set([...englishWords, ...chineseChars, ...wordsFromSpaces]));
}

/**
 * 計算兩個關鍵字集合的重疊度
 */
export function calculateOverlap(keywords1: string[], keywords2: string[]): number {
    if (keywords1.length === 0 || keywords2.length === 0) return 0;
    const set1 = new Set(keywords1);
    const set2 = new Set(keywords2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

/**
 * 計算關鍵字匹配分數
 */
export function calculateKeywordScore(queryKeywords: string[], chunkKeywords: string[]): number {
    if (queryKeywords.length === 0 || chunkKeywords.length === 0) return 0;

    const chunkSet = new Set(chunkKeywords);
    let matchCount = 0;

    for (const keyword of queryKeywords) {
        if (chunkSet.has(keyword)) {
            // 長單詞（詞彙）權重高於單個字
            matchCount += (keyword.length > 1 ? 2 : 1);
        }
    }

    const totalPossibleMatchScore = queryKeywords.reduce((acc, k) => acc + (k.length > 1 ? 2 : 1), 0);

    return matchCount / totalPossibleMatchScore;
}
