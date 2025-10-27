import { T_BoFieldParams } from "../types";

export const convertMapToOwnersArray = (map: Map<string, Array<T_BoFieldParams>>) => {
    return Array.from(map.values()).map((arr) => {
        const obj: Record<string, string> = {};
        arr.forEach((f) => {
            if (f?.fieldname) obj[f.fieldname] = String(f.value ?? "");
        });
        return obj;
    });
};