export const isNumber = (value: string): boolean => {
    if (!value) return true;
    const regexp = /^\d*$/;
    return regexp.test(value);
};
