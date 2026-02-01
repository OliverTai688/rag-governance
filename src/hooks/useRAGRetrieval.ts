/**
 * useRAGRetrieval Hook
 * 
 * 基於關鍵字的 RAG 檢索
 */

import { useCallback } from 'react';
import { DocumentChunk, retrieveTopK } from '@/lib/rag';

export function useRAGRetrieval() {
    const retrieve = useCallback(
        (query: string, chunks: DocumentChunk[], k: number = 5) => {
            return retrieveTopK(query, chunks, k);
        },
        []
    );

    return { retrieve };
}
