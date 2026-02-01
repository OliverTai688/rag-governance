/**
 * Unified Type Definitions for Documents Feature
 * 
 * 集中管理所有與文件相關的類型定義
 */

import { DocumentChunk } from '@/lib/rag';

// ============================================
// QA Related Types
// ============================================

/**
 * 引用來源
 */
export type Citation = {
    paragraphId: string;
    relevance: string;
};

/**
 * QA API 回應格式
 */
export type QAResponse = {
    answer: string;
    citations: Citation[];
};

/**
 * 聊天訊息
 */
export type Message = {
    role: 'user' | 'ai';
    content: string;
    citations?: Citation[];
    citationChunks?: DocumentChunk[];
};

// ============================================
// UI State Types
// ============================================

/**
 * 移動版 Tab 類型
 */
export type MobileTab = 'document' | 'ai';

/**
 * 面板收合狀態
 */
export type PanelCollapseState = {
    left: boolean;
    right: boolean;
};

// ============================================
// Component Props Types
// ============================================

/**
 * 文件清單面板 Props
 */
export type DocumentListPanelProps = {
    selectedDocId: string;
    onSelectDoc: (docId: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
};

/**
 * 文件檢視面板 Props
 */
export type DocumentViewPanelProps = {
    documentTitle: string;
    chunks: DocumentChunk[];
    highlightId: string | null;
};

/**
 * QA 面板 Props
 */
export type QAPanelProps = {
    allChunks: DocumentChunk[];
    onJumpToParagraph: (paragraphId: string) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
};
