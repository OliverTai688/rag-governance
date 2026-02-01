/**
 * QA Service
 * 
 * 負責與 QA API 通訊的服務層
 * 將 API 呼叫邏輯從組件中抽離，提升可測試性與可維護性
 */

import { DocumentChunk } from '@/lib/rag';
import { QAResponse } from '@/types/documents';

export class QAService {
    /**
     * 向 API 發送問題並取得回答
     * 
     * @param question 使用者問題
     * @param chunks 相關的文件段落
     * @returns AI 回答與引用來源
     * @throws 當 API 請求失敗時拋出錯誤
     */
    static async askQuestion(
        question: string,
        chunks: DocumentChunk[],
        history?: { role: 'user' | 'ai'; content: string }[]
    ): Promise<QAResponse> {
        try {
            const response = await fetch('/api/qa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question,
                    chunks,
                    history,
                }),
            });

            // 處理 HTTP 錯誤
            if (!response.ok) {
                let errorMessage = 'API 請求失敗';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.answer || errorMessage;
                } catch {
                    // 如果無法解析錯誤訊息，使用預設訊息
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            return data as QAResponse;

        } catch (error) {
            // 網路錯誤或其他例外
            if (error instanceof Error) {
                console.error('[QAService] Error:', error.message);
                throw error;
            }

            throw new Error('未知錯誤，請稍後再試。');
        }
    }


    /**
     * 驗證 OpenAI API 是否可用
     * 
     * 發送一個簡單的測試請求來檢查 API 連線狀態
     * 
     * @returns API 是否正常運作
     */
    static async validateAPIConnection(): Promise<boolean> {
        try {
            // 發送一個空的測試請求
            const response = await fetch('/api/qa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: 'test',
                    chunks: [],
                }),
            });

            // 只要能收到回應就算成功（即使是 400 錯誤）
            // 因為這表示 API route 本身是正常運作的
            return response.status !== 500;

        } catch (error) {
            console.error('[QAService] API connection validation failed:', error);
            return false;
        }
    }

    /**
     * 批次處理多個問題
     * 
     * @param questions 問題列表
     * @param chunks 相關的文件段落
     * @returns 所有問題的回答
     */
    static async askMultipleQuestions(
        questions: string[],
        chunks: DocumentChunk[]
    ): Promise<QAResponse[]> {
        const promises = questions.map(q => this.askQuestion(q, chunks));
        return Promise.all(promises);
    }
}
