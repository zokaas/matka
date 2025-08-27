import { useMatches } from "react-router";

export function useParentData<T>(pathname: string): T | undefined {
    const matches = useMatches();
    const parentMatch = matches.find((match) => match.pathname === pathname);
    return parentMatch?.data as T | undefined;
}
