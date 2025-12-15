import { T_BoFieldParams } from "../types";

export const convertMapToOwnersArray = (map: Map<string, Array<T_BoFieldParams>>) => {
    return Array.from(map.values()).map((arr) => {
        const obj: Record<string, any> = {};

        arr.forEach((field) => {
            if (field?.fieldname) {
                if (field.fieldname === "BOCountry" && field.text !== undefined) {
                    obj[field.fieldname] = field.text;
                }
                if (field.text !== undefined && field.fieldname === "BOPEP") {
                    obj[`${field.fieldname}Text`] = field.text;
                }
            }
        });
        return obj;
    });
};
