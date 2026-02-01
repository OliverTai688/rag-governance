/**
 * Document List Panel Component
 * 
 * 左側文件清單面板
 * 支援桌面版的收合功能
 */

import { MOCK_DOCS } from '@/lib/docs-mock';


type Props = {
    selectedDocId: string;
    onSelectDoc: (docId: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
};

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(' ');
}

export function DocumentListPanel({
    selectedDocId,
    onSelectDoc,
    collapsed,
    onToggleCollapse,
}: Props) {
    if (collapsed) {
        return (
            <aside className="hidden lg:flex w-12 border-r border-slate-200 flex-col bg-white transition-all duration-300">
                <div className="flex flex-col items-center py-4 gap-3">
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 hover:bg-slate-100 rounded transition-colors"
                        title="展開"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside className="hidden lg:flex w-72 border-r border-slate-200 flex-col bg-white transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-slate-900 text-base">文件庫</h2>
                    <p className="text-xs text-slate-500 mt-1">選擇文件後可於右側提問</p>
                </div>
                <button
                    onClick={onToggleCollapse}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                    title="收合"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
            </div>

            {/* Document List */}
            <div className="p-3 flex-1 overflow-y-auto space-y-2">
                {MOCK_DOCS.map((doc) => (
                    <button
                        key={doc.id}
                        onClick={() => onSelectDoc(doc.id)}
                        className={cx(
                            'w-full text-left p-4 rounded-lg transition-all border',
                            selectedDocId === doc.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        )}
                    >
                        <div className="flex flex-col gap-1">
                            <span
                                className={cx(
                                    'text-[11px] uppercase font-semibold tracking-wide',
                                    selectedDocId === doc.id ? 'text-slate-200' : 'text-slate-400'
                                )}
                            >
                                {doc.type}
                            </span>
                            <span className="font-semibold text-sm leading-tight">{doc.title}</span>
                        </div>
                    </button>
                ))}


            </div>
        </aside>
    );
}
