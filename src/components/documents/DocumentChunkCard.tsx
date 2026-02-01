import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocumentChunk } from '@/lib/rag';

type Props = {
    chunk: DocumentChunk;
    highlightId: string | null;
};

export function DocumentChunkCard({ chunk, highlightId }: Props) {
    const isHighlighted = highlightId === chunk.paragraphId;

    // Simple token estimation (approx 1 token per 0.7 Chinese chars or 1 English word)
    const estimatedTokens = Math.ceil(chunk.content.length * 0.8);

    return (
        <div
            id={chunk.paragraphId}
            className={`
                group relative p-5 rounded-xl border transition-all duration-300 flex flex-col h-full
                ${isHighlighted
                    ? 'bg-amber-50 border-amber-300 shadow-md ring-1 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }
            `}
        >
            {/* Metadata Header */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-mono font-bold tracking-wider">
                        {chunk.paragraphId}
                    </span>
                    {chunk.sectionTitle && (
                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]" title={chunk.sectionTitle}>
                            {chunk.sectionTitle}
                        </span>
                    )}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                    ~{estimatedTokens} tokens
                </div>
            </div>

            {/* Content Preview */}
            <div className="flex-1 min-h-[100px] overflow-hidden">
                <div className="prose prose-slate max-w-none 
                    prose-headings:text-slate-900 prose-headings:font-bold prose-headings:mb-3 prose-headings:mt-2 
                    prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                    prose-p:text-slate-900 prose-p:leading-relaxed prose-p:my-2 prose-p:text-base
                    prose-ul:my-2 prose-li:my-1 prose-li:text-slate-900
                    prose-strong:text-slate-900 prose-strong:font-bold
                    prose-code:bg-slate-100 prose-code:px-1 prose-code:rounded prose-code:text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {chunk.content}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Indexing Visual Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                    Indexed
                </div>
            </div>
        </div>
    );
}
