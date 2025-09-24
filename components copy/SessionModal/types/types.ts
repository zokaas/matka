export type T_SessionModalType = "refresh" | "expired";

export type T_SessionModalPayload = {
    type: T_SessionModalType;
    /** Time left before absolute expiry (ms). Useful for auto-logout countdown. */
    remainingMs?: number;
};
