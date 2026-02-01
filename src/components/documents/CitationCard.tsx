/**
 * Citation Card Component
 * 顯示 AI 回答的引用來源
 */

import { DocumentChunk } from '@/lib/rag';

type CitationCardProps = {
    chunk: DocumentChunk;
    onJumpToParagraph: (paragraphId: string) => void;
};

export function CitationCard({ chunk, onJumpToParagraph }: CitationCardProps) {
    return (
        <button
            onClick={() => onJumpToParagraph(chunk.paragraphId)}
            className="group flex flex-col w-full p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-900/40 hover:bg-slate-50 transition-all text-left shadow-sm"
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-slate-900 transition-colors" />
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                        {chunk.documentTitle}
                    </p>
                </div>
                <span className="shrink-0 text-[10px] font-medium text-slate-400 group-hover:text-slate-900 transition-colors bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
                    查看原文
                </span>
            </div>

            {chunk.sectionTitle && (
                <div className="mt-1 pl-3.5">
                    <p className="text-[10px] text-slate-500 truncate leading-tight">
                        {chunk.sectionTitle} • {chunk.paragraphId}
                    </p>
                </div>
            )}
        </button>
    );
}
