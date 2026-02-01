/**
 * useQAService Hook
 * 
 * 封裝完整的 QA 業務邏輯
 * 整合 RAG 檢索 + OpenAI API 呼叫
 */

import { useCallback } from 'react';
import { DocumentChunk, retrieveTopK } from '@/lib/rag';
import { QAResponse } from '@/types/documents';
import { QAService } from '@/services/qa-service';

export function useQAService(allChunks: DocumentChunk[]) {
    /**
     * 詢問問題並取得回答
     * 
     * 1. 先進行 RAG 檢索，找出 Top-K 相關段落
     * 2. 將段落傳送給 OpenAI API
     * 3. 回傳 AI 回答與引用來源
     */
    const askQuestion = useCallback(
        async (question: string, history: Array<{ role: 'user' | 'ai'; content: string }> = [], overrideChunks?: DocumentChunk[]): Promise<QAResponse> => {
            // Step 1: RAG 檢索 Top-K 段落 (若有 overrideChunks 則跳過)
            const topKChunks = overrideChunks || retrieveTopK(question, allChunks, 5);

            // 如果沒有找到相關段落，直接回傳
            if (topKChunks.length === 0) {
                return {
                    answer: '文件中未找到可支持的內容。',
                    citations: [],
                };
            }

            // Step 2: 呼叫 OpenAI API
            try {
                const response = await QAService.askQuestion(question, topKChunks, history);
                return response;
            } catch (error) {
                // 發生錯誤時，回傳錯誤訊息
                const errorMessage = error instanceof Error
                    ? error.message
                    : '系統錯誤，請稍後再試。';

                return {
                    answer: errorMessage,
                    citations: [],
                };
            }
        },
        [allChunks]
    );

    /**
     * 驗證 API 連線狀態
     */
    const validateConnection = useCallback(async () => {
        return await QAService.validateAPIConnection();
    }, []);

    return {
        askQuestion,
        validateConnection,
    };
}
