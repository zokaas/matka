import { useLocation } from "react-router";

export function useSessionSuppressed(paths: string[] = ["/expired"]) {
    const { pathname } = useLocation();
    return paths.some((p) => pathname.startsWith(p));
}
