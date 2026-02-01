"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

type PlanKey = "basic" | "growth" | "transform";

type TableSpec = {
    fee: string;
    modeling: string;
    database: string;
    rhythm: string;
    ssot: string;
    risk: string;
    customerProfile: string;
    kpi: string;
    training: string;
    shadowing: string;
    maturity: string;
};

type RoadmapPhase = {
    id: string;
    label: string; // Phase name
    weeks: string; // e.g. "W1", "W2-4"
    title: string; // short label for card
    bullets: string[]; // short actions list
    details: {
        goal: string;
        do: string[];
        deliverables: string[];
    };
};

type Plan = {
    key: PlanKey;
    name: string;
    price: string;
    positioning: string; // one-liner
    duration: string; // e.g. "3 months"
    highlights: string[]; // slide bullets
    roadmap: RoadmapPhase[];
    spec: TableSpec;
    footnote?: string;
};

function cn(...args: Array<string | false | null | undefined>) {
    return args.filter(Boolean).join(" ");
}

/**
 * Slide-style component: top-to-bottom sections, each plan has a horizontal roadmap.
 * - Hover phase => tooltip with details
 * - Works on desktop + mobile (mobile roadmap is scrollable horizontally)
 */
export default function PlanSlides() {
    const plans: Plan[] = useMemo(
        () => [
            {
                key: "basic",
                name: "基礎節奏導入",
                price: "100,000 NTD",
                duration: "3 個月陪跑",
                positioning: "建立最小可行治理節奏，讓案件可追蹤、可盤點、可提醒。",
                highlights: [
                    "建立 1 種核心流程模型",
                    "完整案件資料庫與基本節奏運作",
                    "文件型風險提醒（依文件比對並附來源）",
                    "基礎 KPI 指標與 2 次教育訓練",
                ],
                roadmap: [
                    {
                        id: "b-p0",
                        label: "Phase 0",
                        weeks: "W1",
                        title: "現況盤點",
                        bullets: ["流程訪談", "界定核心案件類型", "風險點清單"],
                        details: {
                            goal: "對齊「核心案件」與「治理邊界」，避免導入一開始就失焦。",
                            do: ["訪談承辦與助理", "繪製案件流程與節點", "確認 Pilot 案件類型與責任分工"],
                            deliverables: ["現況流程圖", "Pilot 範圍說明", "核心風險點清單"],
                        },
                    },
                    {
                        id: "b-p1",
                        label: "Phase 1",
                        weeks: "W2–4",
                        title: "資料庫建置",
                        bullets: ["Projects Table", "Stage 定義", "全案件納管"],
                        details: {
                            goal: "建立「單一真實來源」的案件狀態與欄位，讓盤點會議有依據。",
                            do: ["建立案件表結構", "定義階段（Stages）", "導入 Pilot 案件到資料庫"],
                            deliverables: ["專案資料庫 MVP 上線", "Pilot 案件 100% 納入"],
                        },
                    },
                    {
                        id: "b-p2",
                        label: "Phase 2",
                        weeks: "W5–6",
                        title: "節奏 + SSOT",
                        bullets: ["每週盤點會議", "Line 記事本格式", "決議可追蹤"],
                        details: {
                            goal: "讓會議決議與行動項目「可追蹤、可回查」，降低口頭落差。",
                            do: ["建立會議節奏", "制定 Line 記事本模板", "每週盤點固定產出更新"],
                            deliverables: ["會議 SSOT 模板", "每週盤點紀錄樣板", "可追蹤決議清單"],
                        },
                    },
                    {
                        id: "b-p3",
                        label: "Phase 3",
                        weeks: "W7–10",
                        title: "文件型提醒",
                        bullets: ["文件條款比對", "風險提示附來源", "可複製回覆"],
                        details: {
                            goal: "把風險提醒從「靠經驗」變成「有證據、可重複」的提示。",
                            do: ["定義常見風險條款/文件缺件規則", "輸出風險提醒清單（附來源段落）", "準備可複製貼上的訊息模板"],
                            deliverables: ["文件型風險提醒清單", "提醒訊息模板（可複製）"],
                        },
                    },
                    {
                        id: "b-p4",
                        label: "Phase 4",
                        weeks: "W11–12",
                        title: "節奏報告",
                        bullets: ["延誤比例", "常見風險", "月度節奏報告"],
                        details: {
                            goal: "用一份可閱讀的報告收斂成果，作為下一階段優化依據。",
                            do: ["彙整延誤/退件/風險類型", "產出節奏與風險摘要", "回顧導入後工作方式變化"],
                            deliverables: ["1 份完整節奏報告", "後續優化建議清單"],
                        },
                    },
                ],
                spec: {
                    fee: "100,000 NTD",
                    modeling: "建立 1 種核心流程模型",
                    database: "完整版",
                    rhythm: "含",
                    ssot: "含",
                    risk: "文件型提醒（依文件內容比對並附來源）",
                    customerProfile: "無",
                    kpi: "基礎指標",
                    training: "2 次",
                    shadowing: "3 個月",
                    maturity: "無",
                },
            },
            {
                key: "growth",
                name: "成長優化導入",
                price: "180,000 NTD",
                duration: "5 個月陪跑",
                positioning: "在節奏上加上規則型預警與客戶輪廓，提升可預測性與溝通效率。",
                highlights: [
                    "建立 3 種主要流程模型",
                    "規則型風險提醒（依流程/條件觸發）",
                    "客戶輪廓分析（人工可用、季度更新）",
                    "多維 KPI 指標與 3 次教育訓練",
                ],
                roadmap: [
                    {
                        id: "g-p0",
                        label: "Phase 0",
                        weeks: "W1",
                        title: "流程分群",
                        bullets: ["選 3 流程", "差異矩陣", "共用欄位"],
                        details: {
                            goal: "把「多流程」先收斂成可治理的三條主幹。",
                            do: ["選定三種主要流程", "整理流程差異與共用欄位", "定義跨流程共用風險條件"],
                            deliverables: ["三流程範圍與差異矩陣", "共用欄位與風險條件清單"],
                        },
                    },
                    {
                        id: "g-p1",
                        label: "Phase 1",
                        weeks: "W2–6",
                        title: "三流程建模",
                        bullets: ["責任人", "階段標準", "共用規則"],
                        details: {
                            goal: "讓承辦分工可視化，流程之間可比較。",
                            do: ["建 3 流程模型", "定義每節點責任角色", "對齊 Stage 與完成條件"],
                            deliverables: ["3 流程模型", "節點責任與完成條件表"],
                        },
                    },
                    {
                        id: "g-p2",
                        label: "Phase 2",
                        weeks: "W7–10",
                        title: "規則型提醒",
                        bullets: ["條件觸發", "高風險清單", "優先排序"],
                        details: {
                            goal: "把提醒從「看文件」升級到「看狀態與條件」。",
                            do: ["定義觸發條件（逾期、缺件、反覆退件等）", "自動生成高風險案件清單", "建立風險優先排序規則"],
                            deliverables: ["規則型提醒規格", "每週高風險清單輸出"],
                        },
                    },
                    {
                        id: "g-p3",
                        label: "Phase 3",
                        weeks: "W11–16",
                        title: "客戶輪廓",
                        bullets: ["分類模型", "溝通策略", "季度更新"],
                        details: {
                            goal: "讓溝通從臨場反應變成可重複策略。",
                            do: ["建立輪廓類型（急件/焦慮/價格敏感/被動等）", "建立回覆策略模板", "制定季度輪廓更新節奏"],
                            deliverables: ["客戶輪廓分類與模板", "回覆策略建議準則"],
                        },
                    },
                    {
                        id: "g-p4",
                        label: "Phase 4",
                        weeks: "W17–20",
                        title: "多維 KPI",
                        bullets: ["效率指標", "退件/延誤", "月報固定產出"],
                        details: {
                            goal: "讓老闆能用數據回顧與決策，而不是只看感覺。",
                            do: ["設計多維 KPI（週/月）", "彙整退件、延誤、各流程效率", "建立固定月報產出節奏"],
                            deliverables: ["多維 KPI 儀表板", "固定節奏報告樣板"],
                        },
                    },
                ],
                spec: {
                    fee: "180,000 NTD",
                    modeling: "建立 3 種主要流程模型",
                    database: "完整版",
                    rhythm: "含",
                    ssot: "含",
                    risk: "規則型提醒（依組織流程和規則條件觸發）",
                    customerProfile: "含",
                    kpi: "多維指標",
                    training: "3 次",
                    shadowing: "5 個月",
                    maturity: "無",
                },
            },
            {
                key: "transform",
                name: "轉型自動化導入",
                price: "250,000 NTD",
                duration: "6 個月陪跑",
                positioning: "建立流程體系 + 模型判斷型提醒，並加上組織成熟度強化（COSO ERM / ISO9001 / GRPI）。",
                highlights: [
                    "建立 10 以內流程體系模型（可擴充）",
                    "模型判斷型提醒（依組織/專案/職位條件判斷）",
                    "組織成熟度強化：風險觀測 / 資料可追溯 / 團隊發展",
                    "多維 KPI + 3–4 次教育訓練",
                ],
                roadmap: [
                    {
                        id: "t-p0",
                        label: "Phase 0",
                        weeks: "W1–2",
                        title: "體系盤點",
                        bullets: ["流程體系樹", "交互關係", "風險結構"],
                        details: {
                            goal: "把「零散流程」整理成可治理的流程體系。",
                            do: ["盤點 10 以內流程體系", "整理流程間依賴與交互", "定義風險結構層級"],
                            deliverables: ["流程體系地圖", "風險結構說明"],
                        },
                    },
                    {
                        id: "t-p1",
                        label: "Phase 1",
                        weeks: "W3–8",
                        title: "體系建模",
                        bullets: ["職位權責", "節點條件", "跨流程規則"],
                        details: {
                            goal: "讓組織運作可被模型化，支援更高階的提醒與預測。",
                            do: ["建立流程樹狀模型", "對齊職位/責任/交付物", "建立跨流程共同規則與事件"],
                            deliverables: ["流程體系模型", "職位權責對齊表"],
                        },
                    },
                    {
                        id: "t-p2",
                        label: "Phase 2",
                        weeks: "W9–14",
                        title: "模型判斷提醒",
                        bullets: ["條件判斷", "風險排序", "插單衝擊"],
                        details: {
                            goal: "從「規則」進階到「依組織狀態判斷」的優先順序。",
                            do: ["建立人力/專案/職位條件判斷", "風險優先排序機制", "急件插單衝擊評估規則"],
                            deliverables: ["模型判斷提醒規格", "風險排序輸出樣板"],
                        },
                    },
                    {
                        id: "t-p3",
                        label: "Phase 3",
                        weeks: "W15–20",
                        title: "成熟度強化",
                        bullets: ["COSO ERM", "ISO9001", "GRPI"],
                        details: {
                            goal: "把治理變成可持續制度：風險、追溯、團隊三條線同時提升。",
                            do: [
                                "風險觀測（COSO ERM）：人力負荷/退件趨勢/急件影響",
                                "資料可追溯（ISO9001）：權限分級/保存規範/異動紀錄",
                                "團隊發展（GRPI）：工作風格/協作觀測/角色建議",
                            ],
                            deliverables: ["成熟度強化報告（3 條線）", "管理者可用的改善清單"],
                        },
                    },
                    {
                        id: "t-p4",
                        label: "Phase 4",
                        weeks: "W21–24",
                        title: "決策化報告",
                        bullets: ["月報簡報", "改善建議", "下一輪優化"],
                        details: {
                            goal: "讓成果可用於決策與下一輪迭代（不是只做完就結束）。",
                            do: ["輸出月度節奏與風險報告", "建立優化建議簡報版本", "規劃下一輪流程/規則調整"],
                            deliverables: ["月報＋優化建議簡報", "下一輪 Roadmap 草案"],
                        },
                    },
                ],
                spec: {
                    fee: "250,000 NTD",
                    modeling: "建立 10 以內流程體系模型",
                    database: "完整版",
                    rhythm: "含",
                    ssot: "含",
                    risk: "模型判斷型提醒（依組織、專案與職位分析條件觸發）",
                    customerProfile: "含",
                    kpi: "多維指標",
                    training: "3–4 次",
                    shadowing: "6 個月",
                    maturity:
                        "含：風險觀測 COSO ERM（人力負荷／退件趨勢／急件影響）、資料可追溯 ISO9001（權限分級／保存規範／異動紀錄）、團隊發展 GRPI（工作風格／協作觀測／角色建議）",
                },
                footnote: "註：250,000 導入第一年需搭配至少 3,000 維護方案。",
            },
        ],
        []
    );

    const [activePlan, setActivePlan] = useState<PlanKey>("basic");
    const [hoverPhaseId, setHoverPhaseId] = useState<string | null>(null);

    const selectedPlan = plans.find((p) => p.key === activePlan)!;
    const hoveredPhase = selectedPlan.roadmap.find((p) => p.id === hoverPhaseId) || null;

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
                {/* Navigation Bar */}
                <div className="flex items-center justify-between">
                    <Link href="/documents" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        返回顧問工作空間
                    </Link>
                </div>

                {/* Slide 1: Title */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="flex flex-col gap-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Proposal Slides · Implementation Roadmap
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 leading-tight">
                            整合導入方案（一次性）
                        </h1>
                        <p className="text-slate-600 leading-relaxed max-w-3xl">
                            三種方案皆建立完整案件資料庫、專案節奏與 SSOT。差異在流程建模深度、提醒層級與成熟度強化範圍。
                        </p>

                        {/* Plan tabs */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {plans.map((p) => {
                                const active = p.key === activePlan;
                                return (
                                    <button
                                        key={p.key}
                                        onClick={() => {
                                            setActivePlan(p.key);
                                            setHoverPhaseId(null);
                                        }}
                                        className={cn(
                                            "text-left rounded-xl border p-4 transition",
                                            active
                                                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                                : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="font-black">{p.name}</div>
                                            <div className={cn("text-xs font-bold", active ? "text-slate-200" : "text-slate-500")}>
                                                {p.price}
                                            </div>
                                        </div>
                                        <div className={cn("mt-2 text-sm leading-relaxed", active ? "text-slate-200" : "text-slate-600")}>
                                            {p.positioning}
                                        </div>
                                        <div className={cn("mt-3 text-xs font-bold", active ? "text-slate-300" : "text-slate-400")}>
                                            導入陪跑期：{p.duration}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Slide 2: Plan Summary */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Plan Summary</div>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">{selectedPlan.name}</h2>
                            <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">{selectedPlan.positioning}</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Fee</div>
                            <div className="mt-2 text-2xl font-black text-slate-900">{selectedPlan.price}</div>
                            <div className="mt-1 text-sm font-bold text-slate-500">{selectedPlan.duration}</div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {selectedPlan.highlights.map((t, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Key Point {String(idx + 1).padStart(2, "0")}
                                </div>
                                <div className="text-slate-900 font-bold leading-relaxed">{t}</div>
                            </div>
                        ))}
                    </div>

                    {selectedPlan.footnote && (
                        <div className="mt-6 border border-amber-200 bg-amber-50 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
                            {selectedPlan.footnote}
                        </div>
                    )}
                </section>

                {/* Slide 3: Horizontal Roadmap */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="flex items-start justify-between gap-6">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Implementation Roadmap</div>
                            <h2 className="mt-2 text-2xl font-black text-slate-900">導入過程（水平 Roadmap）</h2>
                            <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">
                                由左至右為導入階段。滑鼠移到卡片可查看詳細資訊（目標／會做的事／交付物）。
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Duration</div>
                            <div className="mt-2 text-lg font-black text-slate-900">{selectedPlan.duration}</div>
                        </div>
                    </div>

                    <div className="mt-6 relative">
                        {/* Scroll container for mobile */}
                        <div className="overflow-x-auto pb-3">
                            <div className="min-w-[980px]">
                                {/* Timeline line */}
                                <div className="relative mt-4">
                                    <div className="absolute left-0 right-0 top-6 h-0.5 bg-slate-200" />
                                    <div className="grid grid-cols-5 gap-4">
                                        {selectedPlan.roadmap.map((phase) => {
                                            const isHovered = hoverPhaseId === phase.id;
                                            return (
                                                <div
                                                    key={phase.id}
                                                    className="relative"
                                                    onMouseEnter={() => setHoverPhaseId(phase.id)}
                                                    onMouseLeave={() => setHoverPhaseId(null)}
                                                >
                                                    {/* Node */}
                                                    <div className={cn("mx-auto w-4 h-4 rounded-full border-4 bg-white", isHovered ? "border-slate-900" : "border-slate-300")} />

                                                    {/* Card */}
                                                    <div
                                                        className={cn(
                                                            "mt-4 rounded-xl border p-4 transition shadow-sm bg-white",
                                                            isHovered ? "border-slate-900" : "border-slate-200"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{phase.label}</div>
                                                            <div className="text-xs font-bold text-slate-500">{phase.weeks}</div>
                                                        </div>
                                                        <div className="mt-2 font-black text-slate-900">{phase.title}</div>

                                                        <ul className="mt-3 space-y-1 text-sm text-slate-600 leading-relaxed">
                                                            {phase.bullets.map((b, idx) => (
                                                                <li key={idx} className="flex gap-2">
                                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                                                    <span>{b}</span>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        <div className="mt-3 text-xs font-bold text-slate-400">
                                                            Hover 查看詳細
                                                        </div>
                                                    </div>

                                                    {/* Tooltip */}
                                                    {isHovered && (
                                                        <div className="absolute z-20 left-0 right-0 -top-2 translate-y-[-100%]">
                                                            <div className="rounded-xl border border-slate-900 bg-slate-900 text-white p-4 shadow-lg">
                                                                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                                                    {phase.label} · {phase.weeks}
                                                                </div>
                                                                <div className="mt-2 text-base font-black">{phase.details.goal}</div>

                                                                <div className="mt-3 grid grid-cols-1 gap-3">
                                                                    <div>
                                                                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">會做的事</div>
                                                                        <ul className="text-sm text-slate-100 space-y-1 leading-relaxed">
                                                                            {phase.details.do.map((x, i) => (
                                                                                <li key={i} className="flex gap-2">
                                                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                                                                                    <span>{x}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">交付物</div>
                                                                        <ul className="text-sm text-slate-100 space-y-1 leading-relaxed">
                                                                            {phase.details.deliverables.map((x, i) => (
                                                                                <li key={i} className="flex gap-2">
                                                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                                                                                    <span>{x}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mx-auto w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-slate-900" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-3 text-xs text-slate-400">
                                    行動提示：手機可左右滑動 Roadmap；桌機 Hover 可看細節。
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Slide 4: Spec Alignment (matches your table) */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Spec Alignment</div>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">方案規格對齊（對應表格欄位）</h2>
                    <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">
                        此區塊用來保證你的「方案描述」最終可回扣到表格欄位，不會寫成空泛敘述。
                    </p>

                    <div className="mt-6 overflow-x-auto">
                        <table className="min-w-[900px] w-full border border-slate-200 rounded-xl overflow-hidden">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-600 p-4 border-b border-slate-200">
                                        項目
                                    </th>
                                    <th className="text-left text-xs font-black uppercase tracking-wider text-slate-600 p-4 border-b border-slate-200">
                                        {selectedPlan.name}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["導入費", selectedPlan.spec.fee],
                                    ["案件建模範圍", selectedPlan.spec.modeling],
                                    ["專案資料庫建置", selectedPlan.spec.database],
                                    ["專案節奏設計", selectedPlan.spec.rhythm],
                                    ["SSOT 建立", selectedPlan.spec.ssot],
                                    ["自動風險提醒", selectedPlan.spec.risk],
                                    ["客戶輪廓分析", selectedPlan.spec.customerProfile],
                                    ["KPI 儀表板", selectedPlan.spec.kpi],
                                    ["教育訓練", selectedPlan.spec.training],
                                    ["導入陪跑期", selectedPlan.spec.shadowing],
                                    ["組織成熟度強化", selectedPlan.spec.maturity],
                                ].map(([k, v]) => (
                                    <tr key={k} className="border-b border-slate-100 last:border-b-0">
                                        <td className="p-4 text-sm font-bold text-slate-700 bg-white w-[240px]">{k}</td>
                                        <td className="p-4 text-sm text-slate-700 bg-white leading-relaxed">{v}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Slide 5: Optional - maintenance tie-in (short, not heavy) */}
                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Maintenance Tie-in</div>
                    <h2 className="mt-2 text-2xl font-black text-slate-900">導入後銜接（維護與顧問）</h2>
                    <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">
                        導入完成後，維護方案主要負責系統維護、備份與 AI 使用量控管；顧問方案則包含節奏報告與優化檢視。
                    </p>

                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-sm font-black text-slate-900">基礎維護</div>
                            <div className="mt-2 text-2xl font-black text-slate-900">1,000</div>
                            <div className="text-xs font-bold text-slate-500">NTD / 月</div>
                            <div className="mt-4 text-sm text-slate-700 leading-relaxed">
                                技術維護 / 更新 / 備份 / 150,000 tokens
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-900 bg-slate-900 p-5 text-white">
                            <div className="text-sm font-black">成長顧問</div>
                            <div className="mt-2 text-2xl font-black">3,000</div>
                            <div className="text-xs font-bold text-slate-300">NTD / 月</div>
                            <div className="mt-4 text-sm text-slate-100 leading-relaxed">
                                案件語境分析 / 回覆策略 / 月報 / 每月 1 次顧問會議 / 400,000 tokens
                            </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                            <div className="text-sm font-black text-slate-900">自動化強化</div>
                            <div className="mt-2 text-2xl font-black text-slate-900">8,000</div>
                            <div className="text-xs font-bold text-slate-500">NTD / 月</div>
                            <div className="mt-4 text-sm text-slate-700 leading-relaxed">
                                全流程自動分析 / 優化建議簡報 / 1,000,000 tokens
                            </div>
                        </div>
                    </div>

                    {activePlan === "transform" && (
                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
                            提醒：轉型自動化導入（250,000）第一年需搭配至少 3,000 維護方案，以維持模型提醒與報告產出節奏。
                        </div>
                    )}
                </section>

                {/* Footer */}
                <div className="pb-8 text-xs text-slate-400 text-center">
                    © 工程顧問 · 專案提案展示
                </div>
            </div>
        </div>
    );
}
