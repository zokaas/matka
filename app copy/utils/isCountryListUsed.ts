import { T_Question } from "~/types";

export const isCountryListUsed = (item: T_Question): boolean => {
    if (item.question.dependentQuestion?.useCountryList) return true;

    if (item.question.useCountryList) return true;

    return false;
};
