export type T_ActionResponse =
    | { success: true }
    | { success: false; message: string; serverResult?: unknown; error?: unknown };
