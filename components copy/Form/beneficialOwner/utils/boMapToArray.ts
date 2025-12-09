import { T_BoFieldParams } from "../types";

export const convertMapToOwnersArray = (map: Map<string, Array<T_BoFieldParams>>) => {
    return Array.from(map.values()).map((arr) => {
        const obj: Record<string, any> = {};

        arr.forEach((field) => {
            if (field?.fieldname) {
                if (field.text !== undefined) {
                    obj[field.fieldname] = field.value;
                    obj[`${field.fieldname}Text`] = field.text;
                } else {
                    obj[field.fieldname] = field.value;
                }
            }
        });
        return obj;
    });
};
