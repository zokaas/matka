import { T_BffProps } from "../types";

const mock: boolean = (import.meta.env.VITE_MOCK as string) === "1";

const cid: string = import.meta.env.VITE_AUTH_CLIENT_ID as string;
const lang: string = import.meta.env.VITE_LOCALE as string;

const basebffUrl: string = mock
    ? (import.meta.env.VITE_MOCK_BFF_URL as string)
    : (import.meta.env.VITE_BFF_URL as string);

const bffSessionEndpoint = import.meta.env.VITE_BFF_SESSION_ENDPOINT;

const sessionStartPath: string = import.meta.env.VITE_SESSION_START_PATH as string;
const sessionVerifyPath: string = import.meta.env.VITE_SESSION_VERIFY_PATH as string;
const userInfoPath: string = import.meta.env.VITE_SESSION_INFO_PATH as string;
const sessioLogoutPath: string = import.meta.env.VITE_SESSION_LOGOUT_PATH as string;
const refreshSessionPath: string = import.meta.env.VITE_SESSION_REFRESH_PATH as string;

const bffSessionBaseUrl = `${basebffUrl}/${bffSessionEndpoint}`;

const authUrl: string = `${bffSessionBaseUrl}/${sessionStartPath}`;
const verifyUrl: string = `${bffSessionBaseUrl}/${sessionVerifyPath}`;
const logoutUrl: string = `${bffSessionBaseUrl}/${sessioLogoutPath}`;
const getUserDataUrl: string = `${bffSessionBaseUrl}/${userInfoPath}`;
const refreshSessionUrl: string = `${basebffUrl}/${refreshSessionPath}`;

const expiredUrl: string = "/expired";
const errorUrl: string = "/error";

export const getBffProps = (): T_BffProps => {
    const bffProps = {
        mock,
        cid,
        lang,
        basebffUrl,
        authUrl,
        verifyUrl,
        errorUrl,
        expiredUrl,
        getUserDataUrl,
        logoutUrl,
        refreshSessionUrl,
    };

    return bffProps;
};
