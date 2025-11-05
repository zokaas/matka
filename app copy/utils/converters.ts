import { T_AnswerValue } from "~/types";

export const valueAsString = (val: T_AnswerValue): string => {
        if (val === undefined || val === null) return "";
        if (typeof val === "string") return val;
        if (typeof val === "number") return String(val);
        if (typeof val === "boolean") return String(val);
        return "";
    };