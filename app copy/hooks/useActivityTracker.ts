import { useEffect, useRef } from "react";

export function useActivityTracker(throttleMs = 1000) {
    const lastActivityRef = useRef<number>(Date.now());
    const lastUpdateRef = useRef<number>(Date.now());

    useEffect(() => {
        const onActivity = () => {
            const now = Date.now();
            // Only update if enough time has passed
            if (now - lastUpdateRef.current >= throttleMs) {
                lastActivityRef.current = now;
                lastUpdateRef.current = now;
            }
        };

        const events: { name: string; options?: AddEventListenerOptions }[] = [
            { name: "mousemove" },
            { name: "keydown" },
            { name: "touchstart", options: { passive: true } },
            { name: "touchmove", options: { passive: true } },
            { name: "scroll", options: { passive: true } },
        ];

        events.forEach(({ name, options }) => window.addEventListener(name, onActivity, options));

        return () => {
            events.forEach(({ name, options }) =>
                window.removeEventListener(name, onActivity, options)
            );
        };
    }, [throttleMs]);

    const getLastActivity = () => lastActivityRef.current;
    return { getLastActivity, lastActivityRef };
}
