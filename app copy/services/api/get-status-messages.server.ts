import { appConfig } from "~/config";
import { T_StatusMessagesData, T_StatusMessagesResponse } from "./types";

export const getStatusMessages = async (lang: string = "en"): Promise<T_StatusMessagesData> => {
    const { bffBaseUrl } = appConfig;
    const url = `${bffBaseUrl}/content/status-message/${lang}`;

    try {
        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) return {};

        const data: T_StatusMessagesResponse = await response.json();
        return data?.data?.messages || {};
    } catch (error) {
        console.error("Failed to fetch status messages:", error);
        return {};
    }
};
