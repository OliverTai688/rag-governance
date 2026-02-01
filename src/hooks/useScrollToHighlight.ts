/**
 * useScrollToHighlight Hook
 * 
 * 捲動至指定段落並臨時高亮（1.5 秒）
 */

import { useState, useCallback, useRef } from 'react';

export function useScrollToHighlight() {
    const [highlightId, setHighlightId] = useState<string | null>(null);
    const timeoutRef = useRef<number | null>(null);

    const scrollToParagraph = useCallback((paragraphId: string) => {
        // 清除之前的 timeout
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        // 尋找目標元素
        const element = document.getElementById(paragraphId);
        if (!element) {
            console.warn(`段落 ${paragraphId} 不存在`);
            return;
        }

        // 捲動至該元素（置中）
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 設定高亮
        setHighlightId(paragraphId);

        // 1.5 秒後移除高亮
        timeoutRef.current = window.setTimeout(() => {
            setHighlightId(null);
            timeoutRef.current = null;
        }, 1500);
    }, []);

    return { highlightId, scrollToParagraph };
}
