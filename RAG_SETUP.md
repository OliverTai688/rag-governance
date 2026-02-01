# RAG 引用問答系統｜設定指南

## 環境變數設定

1. 複製範例檔案：
```bash
cp .env.local.example .env.local
```

2. 編輯 `.env.local`，填入你的 OpenAI API 金鑰：
```env
OPENAI_API_KEY=sk-proj-xxxxx
```

3. 取得 API 金鑰：https://platform.openai.com/api-keys

## 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器：http://localhost:3000/documents

## 功能驗收清單

### 基本功能
- [ ] 文件能正確切段並顯示段落 ID（開發模式下可見）
- [ ] 問「專案目標是什麼？」→ 回答 + 至少 1 個 citation
- [ ] 問「三個方案差異？」→ 回答 + citation 指向方案文件
- [ ] 問「不存在的問題」→ "文件中未找到可支持的內容。"

### Citation 功能
- [ ] Citation 卡片顯示：文件名、段落 ID、摘錄
- [ ] 點擊 citation → 文件區捲動至段落
- [ ] 點擊 citation → 段落高亮 1.5 秒（黃色背景 + ring）
- [ ] 跨文件 citation → 自動切換文件 + 捲動

### 響應式設計
- [ ] 桌機（≥1024px）：三欄佈局正常顯示
- [ ] 手機（<1024px）：Tab 切換正常
- [ ] 手機點 citation → 自動切到「文件」Tab + 捲動

### UI/UX
- [ ] 無 emoji（除非文件內容本身有）
- [ ] 無行銷標語
- [ ] 載入狀態顯示（三點跳動動畫）
- [ ] 錯誤訊息友善

## 疑難排解

### API 錯誤：401 Unauthorized
- 檢查 `.env.local` 中的 `OPENAI_API_KEY` 是否正確
- 確認 API key 有效且有餘額

### API 錯誤：429 Too Many Requests
- OpenAI API 額度用盡，請稍後再試或升級方案

### 找不到段落
- 確認段落 ID 格式正確（例如：`doc-charter-p3`）
- 檢查文件是否已正確切段（Console 中查看）

### 手機版跳轉無效
- 確保跳轉前已切換到「文件」Tab
- 檢查是否有 `setTimeout` 延遲（等待 DOM 更新）

## 技術架構

### 前端 RAG 流程
1. 使用者提問
2. 關鍵字分詞（`tokenize`）
3. 計算相似度（Jaccard similarity）
4. Top-K 檢索（預設 K=5）
5. 傳送 chunks 到 `/api/qa`
6. OpenAI 生成答案 + citations
7. 顯示答案 + 引用卡片
8. 點擊引用 → 捲動高亮

### 檔案結構
```
src/
├── app/
│   ├── api/qa/route.ts          # OpenAI API endpoint
│   └── documents/page.tsx       # 主頁面
├── components/documents/
│   ├── DocumentViewer.tsx       # 文件閱讀器
│   ├── AIQAPanel.tsx           # 問答面板
│   └── CitationCard.tsx        # 引用卡片
├── hooks/
│   ├── useDocumentChunking.ts  # 切段 Hook
│   ├── useRAGRetrieval.ts      # 檢索 Hook
│   └── useScrollToHighlight.ts # 捲動高亮 Hook
└── lib/rag/
    ├── chunking.ts             # 切段邏輯
    ├── tokenizer.ts            # 分詞工具
    └── retrieval.ts            # 檢索邏輯
```

## 未來擴充

- [ ] Embedding-based retrieval（替換關鍵字檢索）
- [ ] 多文件聯合檢索優化
- [ ] 引用段落前後文預覽
- [ ] 問答歷史紀錄
- [ ] 匯出對話為 Markdown/PDF
