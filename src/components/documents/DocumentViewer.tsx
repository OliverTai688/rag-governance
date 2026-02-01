/**
 * Document Viewer Component
 * 渲染帶段落錨點的 Markdown 文件
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DocumentChunk } from '@/lib/rag';

type DocumentViewerProps = {
    chunks: DocumentChunk[];
    highlightId: string | null;
};

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(' ');
}

export function DocumentViewer({ chunks, highlightId }: DocumentViewerProps) {
    if (chunks.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                <p className="text-sm">沒有可顯示的內容</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 lg:p-12 shadow-sm rounded-xl border border-slate-200 max-w-4xl mx-auto">
            {/* 高亮提示 */}
            {highlightId && (
                <div className="mb-6 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    已定位至引用段落：<span className="font-mono font-semibold">{highlightId}</span>
                </div>
            )}

            {/* 逐段渲染 */}
            <div className="">
                {chunks.map((chunk, index) => {
                    const isHighlighted = highlightId === chunk.paragraphId;

                    return (
                        <div
                            key={chunk.paragraphId}
                            id={chunk.paragraphId}
                            className={cx(
                                'scroll-mt-32 transition-colors duration-500',
                                // 移除所有間距與卡片樣式，僅保留高亮底色
                                isHighlighted ? 'bg-amber-100/50 -mx-4 px-4 py-1 rounded' : 'py-1'
                            )}
                        >
                            {/* 段落標記 - 已移除 */}

                            {/* Markdown 渲染 */}
                            <div
                                className={cx(
                                    'prose prose-slate max-w-none',
                                    'prose-headings:font-bold prose-headings:text-slate-900',
                                    'prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-2 prose-h1:border-b prose-h1:border-slate-100',
                                    'prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8',
                                    'prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6',
                                    'prose-p:text-slate-800 prose-p:leading-relaxed prose-p:mb-4',
                                    'prose-blockquote:border-l-4 prose-blockquote:border-slate-200 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600',
                                    'prose-ul:list-disc prose-ul:pl-5 prose-ul:my-4 prose-ul:space-y-1',
                                    'prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-4 prose-ol:space-y-1',
                                    'prose-li:text-slate-800',
                                    'prose-table:w-full prose-table:border-collapse prose-table:my-6',
                                    'prose-th:border-b-2 prose-th:border-slate-200 prose-th:p-2 prose-th:text-left prose-th:font-semibold',
                                    'prose-td:border-b prose-td:border-slate-100 prose-td:p-2',
                                    'prose-code:bg-slate-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:text-slate-800 prose-code:before:hidden prose-code:after:hidden'
                                )}
                            >
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {chunk.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
