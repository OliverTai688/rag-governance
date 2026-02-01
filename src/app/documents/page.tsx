"use client";

import { useState, useEffect } from "react";
import { Doc } from "@/lib/docs-mock";
import { useDocumentChunking, useAllDocumentsChunking } from "@/hooks/useDocumentChunking";
import { useScrollToHighlight } from "@/hooks/useScrollToHighlight";
import { DocumentListPanel } from "./components/DocumentListPanel";
import { DocumentViewPanel } from "./components/DocumentViewPanel";
import { MobileDocumentSelector } from "./components/MobileDocumentSelector";
import { QAPanel } from "./components/QAPanel";
import { AIQAPanel } from "@/components/documents/AIQAPanel";
import { useQAService } from "@/hooks/useQAService";

type MobileTab = "document" | "ai";

function cx(...classes: Array<string | false | undefined | null>) {
    return classes.filter(Boolean).join(" ");
}

export default function DocumentsPage() {
    // ============================================
    // State Management
    // ============================================
    const [documents, setDocuments] = useState<Doc[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    const [mobileTab, setMobileTab] = useState<MobileTab>("document");
    const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
    const [rightPanelWidth, setRightPanelWidth] = useState(420);
    const [isResizing, setIsResizing] = useState(false);

    // ============================================
    // Fetch Documents
    // ============================================
    useEffect(() => {
        async function fetchDocs() {
            try {
                const res = await fetch('/api/docs');
                if (!res.ok) throw new Error('Failed to fetch docs');
                const data = await res.json();
                setDocuments(data);
                setSelectedDoc(data[0]);
            } catch (err) {
                console.error('Error loading documents:', err);
            } finally {
                setIsLoadingDocs(false);
            }
        }
        fetchDocs();
    }, []);

    // ============================================
    // Resizing Logic
    // ============================================
    const startResizing = (e: React.MouseEvent) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const stopResizing = () => {
        setIsResizing(false);
    };

    const resize = (e: MouseEvent) => {
        if (isResizing) {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth >= 320 && newWidth <= 800) {
                setRightPanelWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResizing);
        } else {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        }

        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing]);

    // ============================================
    // Data & Logic Hooks
    // ============================================
    // selectedDoc is null initially, so we provide a placeholder to hooks that expect a Doc
    const currentDocChunks = useDocumentChunking(selectedDoc || { id: '', title: '', content: '', type: 'Project', fileName: '' });
    const allChunks = useAllDocumentsChunking(documents);
    const { highlightId, scrollToParagraph } = useScrollToHighlight();
    const { askQuestion } = useQAService(allChunks);

    // ============================================
    // Handlers
    // ============================================

    const handleSelectDoc = (docId: string) => {
        const doc = documents.find((d) => d.id === docId);
        if (doc) {
            setSelectedDoc(doc);
        }
    };

    const handleJumpToParagraph = (paragraphId: string) => {
        const chunk = allChunks.find((c) => c.paragraphId === paragraphId);

        if (!chunk) {
            console.warn(`段落 ${paragraphId} 不存在`);
            return;
        }

        if (selectedDoc && chunk.documentId !== selectedDoc.id) {
            const targetDoc = documents.find((d) => d.id === chunk.documentId);
            if (targetDoc) {
                setSelectedDoc(targetDoc);
            }
        }

        if (window.innerWidth < 1024) {
            setMobileTab("document");
        }

        setTimeout(() => {
            scrollToParagraph(paragraphId);
        }, 100);
    };

    // ============================================
    // Render
    // ============================================

    if (isLoadingDocs || !selectedDoc) {
        return (
            <div className="h-full min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                    <p className="text-sm font-medium text-slate-500">載入文件中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen bg-slate-50 flex flex-col overflow-hidden">
            {/* Mobile Document Selector */}
            <div className={cx(
                "lg:hidden",
                mobileTab !== "document" ? "hidden" : "block"
            )}>
                <MobileDocumentSelector
                    documents={documents}
                    selectedDocId={selectedDoc.id}
                    onSelectDoc={handleSelectDoc}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Document List (Desktop Only) */}
                <DocumentListPanel
                    selectedDocId={selectedDoc.id}
                    onSelectDoc={handleSelectDoc}
                    collapsed={leftPanelCollapsed}
                    onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
                />

                {/* Center: Document Viewer */}
                <div
                    className={cx(
                        "flex-1",
                        mobileTab !== "document" ? "hidden lg:flex" : "flex"
                    )}
                >
                    <DocumentViewPanel
                        documentTitle={selectedDoc.title}
                        chunks={currentDocChunks}
                        highlightId={highlightId}
                    />
                </div>

                {/* Resizer Handle */}
                {!rightPanelCollapsed && (
                    <div
                        onMouseDown={startResizing}
                        className={cx(
                            "hidden lg:block w-1.5 hover:w-2 bg-slate-100 hover:bg-slate-300 transition-all cursor-col-resize shrink-0 relative z-30",
                            isResizing && "bg-slate-400 w-2"
                        )}
                    >
                        <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
                    </div>
                )}

                {/* Right: Q&A Panel (Desktop) */}
                <QAPanel
                    allChunks={allChunks}
                    onJumpToParagraph={handleJumpToParagraph}
                    collapsed={rightPanelCollapsed}
                    onToggleCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
                    width={rightPanelWidth}
                />

                {/* Right: Q&A Panel (Mobile) */}
                <div
                    className={cx(
                        "lg:hidden w-full flex flex-col bg-white",
                        mobileTab !== "ai" ? "hidden" : "flex"
                    )}
                >
                    <AIQAPanel
                        onAskQuestion={askQuestion}
                        allChunks={allChunks}
                        onJumpToParagraph={handleJumpToParagraph}
                    />
                </div>
            </div>

            {/* Mobile Bottom Tab Bar */}
            <div className="lg:hidden bg-white border-t border-slate-200 pb-safe z-30">
                <div className="flex items-center justify-around">
                    <button
                        onClick={() => setMobileTab("document")}
                        className={cx(
                            "flex-1 py-3 flex flex-col items-center gap-1 transition-colors relative",
                            mobileTab === "document" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                            {mobileTab === "document" && <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-900 rounded-full animate-in zoom-in" />}
                        </div>
                        <span className="text-[10px] font-bold tracking-wide">文件閱讀</span>
                    </button>
                    <button
                        onClick={() => setMobileTab("ai")}
                        className={cx(
                            "flex-1 py-3 flex flex-col items-center gap-1 transition-colors relative",
                            mobileTab === "ai" ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={mobileTab === "ai" ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                            {mobileTab === "ai" && <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full animate-in zoom-in" />}
                        </div>
                        <span className={cx("text-[10px] font-bold tracking-wide", mobileTab === "ai" && "text-indigo-600")}>AI 顧問</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
