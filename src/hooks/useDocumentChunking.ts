/**
 * useDocumentChunking Hook
 * 
 * 將文件切分為段落級別的 chunks
 * 自動快取，避免重複計算
 */

import { useMemo } from 'react';
import { chunkDocument, DocumentChunk } from '@/lib/rag';
import { Doc } from '@/lib/docs-mock';

export function useDocumentChunking(document: Doc): DocumentChunk[] {
    return useMemo(() => {
        return chunkDocument(document.id, document.title, document.content);
    }, [document.id, document.title, document.content]);
}

/**
 * useAllDocumentsChunking Hook
 * 
 * 將所有文件切分為 chunks（用於跨文件檢索）
 */
export function useAllDocumentsChunking(documents: Doc[]): DocumentChunk[] {
    return useMemo(() => {
        const allChunks: DocumentChunk[] = [];

        for (const doc of documents) {
            const chunks = chunkDocument(doc.id, doc.title, doc.content);
            allChunks.push(...chunks);
        }

        return allChunks;
    }, [documents]);
}
