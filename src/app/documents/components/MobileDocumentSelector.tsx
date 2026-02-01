import { useState, useRef, useEffect } from 'react';
import { Doc } from '@/lib/docs-mock';

type Props = {
    documents: Doc[];
    selectedDocId: string;
    onSelectDoc: (docId: string) => void;
};

export function MobileDocumentSelector({ documents, selectedDocId, onSelectDoc }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const selectedDoc = documents.find(d => d.id === selectedDocId);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative z-30">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white border-b border-slate-200 active:bg-slate-50 transition-colors"
            >
                <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5 text-left">
                        Reading
                    </span>
                    <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {selectedDoc?.title || '選擇文件'}
                    </h2>
                </div>
                <div className={`p-1.5 rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
            </button>

            {/* Dropdown Menu (Slide down) */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/20 z-10" onClick={() => setIsOpen(false)} />

                    {/* Menu Content */}
                    <div
                        ref={menuRef}
                        className="absolute top-full left-0 right-0 bg-white shadow-xl border-b border-slate-200 z-20 max-h-[60vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
                    >
                        <div className="p-2 space-y-1">
                            {documents.map((doc) => {
                                const isSelected = doc.id === selectedDocId;
                                return (
                                    <button
                                        key={doc.id}
                                        onClick={() => {
                                            onSelectDoc(doc.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${isSelected
                                                ? 'bg-slate-900 text-white shadow-sm'
                                                : 'text-slate-700 hover:bg-slate-50 active:scale-[0.98]'
                                            }`}
                                    >
                                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-white/10' : 'bg-slate-100'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isSelected ? 'text-white' : 'text-slate-500'}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        </div>
                                        <div>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider block mb-0.5 ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                                                {doc.type}
                                            </span>
                                            <span className="font-bold text-sm leading-snug block">
                                                {doc.title}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div className="ml-auto self-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
