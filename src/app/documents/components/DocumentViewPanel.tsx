/**
 * Document View Panel Component
 * 
 * 中央文件檢視面板
 * 顯示文件標題、段落數量與內容
 */

import { useState } from 'react';
import { DocumentChunk } from '@/lib/rag';
import { DocumentViewer } from '@/components/documents/DocumentViewer';
import { DocumentChunkCard } from '@/components/documents/DocumentChunkCard';

type ViewMode = 'markdown' | 'rag';

type Props = {
    documentTitle: string;
    chunks: DocumentChunk[];
    highlightId: string | null;
};

export function DocumentViewPanel({ documentTitle, chunks, highlightId }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('markdown');

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
            {/* Header */}
            <header className="p-3 lg:p-6 border-b border-slate-200 bg-white/90 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-slate-900 text-white rounded-lg shrink-0 hidden lg:block">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <div className="flex-1 min-w-0 lg:block hidden">
                        <h2 className="font-bold text-slate-900 text-sm lg:text-lg leading-tight line-clamp-2">
                            {documentTitle}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] lg:text-xs text-slate-500">
                                共 {chunks.length} 個段落
                            </p>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 shrink-0 ml-2">
                        <button
                            onClick={() => setViewMode('markdown')}
                            className={`px-2.5 py-1.5 text-[10px] lg:text-xs font-semibold rounded-md transition-all ${viewMode === 'markdown'
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            文件
                        </button>
                        <button
                            onClick={() => setViewMode('rag')}
                            className={`px-2.5 py-1.5 text-[10px] lg:text-xs font-semibold rounded-md transition-all ${viewMode === 'rag'
                                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            資料
                        </button>
                    </div>
                </div>
            </header>

            {/* Document Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-3 lg:p-8">
                    {viewMode === 'markdown' ? (
                        <DocumentViewer chunks={chunks} highlightId={highlightId} />
                    ) : (
                        <div className="max-w-4xl mx-auto space-y-4">
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                                <div>
                                    <p className="font-semibold mb-1">關於資料視角 (RAG View)</p>
                                    <p className="opacity-90">
                                        此模式展示系統如何將文件切分為獨立的知識塊 (Chunks)。每個卡片代表一個可被檢索的單位，AI 會根據這些片段來回答問題。
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chunks.map((chunk) => (
                                    <DocumentChunkCard
                                        key={chunk.paragraphId}
                                        chunk={chunk}
                                        highlightId={highlightId}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
