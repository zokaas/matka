import { T_FrendsProps } from "../types";

const mock: boolean = (import.meta.env.VITE_MOCK as string) === "1";
const frendsUrl = mock ? import.meta.env.VITE_MOCK_BFF_URL : import.meta.env.VITE_FRENDS_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const getFrendsProps = (): T_FrendsProps => {
    const frendsProps = {
        mock,
        frendsUrl,
        apiKey,
    };

    return frendsProps;
};
