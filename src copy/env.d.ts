/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_KVK_COMPANIES_SEARCH_API_URL: string;
    readonly VITE_KVK_COMPANY_PROFILE_API_URL: string;
    readonly VITE_KVK_API_KEY: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
