import { useEffect } from "react";

export function useDebouncedEffect(
  effect: () => void,
  delay: number) {
  useEffect(() => {
    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
  }, [delay, effect]);
}
