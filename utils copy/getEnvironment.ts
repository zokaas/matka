type Environment = "development" | "production";
export const APP_ENV: Environment =
    import.meta.env.VITE_APP_ENV === "production" ? "production" : "development";

export const isProduction: number = APP_ENV === "production" ? 1 : 0;
