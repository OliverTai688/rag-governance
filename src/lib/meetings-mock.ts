export type Meeting = {
    id: string;
    title: string;
    date: string;
    discussion: string;
    decisions: string[];
    actionItems: string[];
};

export const MOCK_MEETINGS: Meeting[] = [
    {
        id: "mtg_phase0",
        title: "第一次會議：Phase 0 現況盤點",
        date: "2026-02-02",
        discussion: "針對代書事務所現況進行盤點。確立了 Pilot 將選定單一案件類型執行。討論了目前 Line 溝通分散、無統一資料庫的問題。",
        decisions: [
            "選定『買賣移轉』作為第一個 Pilot 流程。",
            "確立每週二固定進行案件盤點會議。",
            "同意導入輕量化資料庫 (Airtable/Supabase)。"
        ],
        actionItems: [
            "顧問：繪製現況案件流程圖 (2/5 入)",
            "事務所：盤點目前進行中案件清單 (2/4 前)",
            "顧問：建立專案資料庫雛形 (2/9 入)"
        ]
    }
];
