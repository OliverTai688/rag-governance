/**
 * Mock Documents for Advisor RAG
 * 
 * 靜態文件元數據定義
 * 內容已抽離至 /docs/*.md
 */

export type DocumentType = 'Project' | 'Plan';

export type Doc = {
  id: string;
  title: string;
  type: DocumentType;
  fileName: string;
  content?: string; // 內容將由 API 端動態載入
};

export const MOCK_DOCS: Doc[] = [
  {
    id: 'doc_charter',
    title: '地政事務所數位治理工作空間建置',
    type: 'Project',
    fileName: 'charter.md'
  },
  {
    id: 'doc_proposal',
    title: '整合導入方案提案',
    type: 'Plan',
    fileName: 'proposal.md'
  },
  {
    id: "doc_roadmap",
    title: "導入時程與階段細節 (Roadmap)",
    type: "Plan",
    fileName: 'roadmap.md'
  }
];
