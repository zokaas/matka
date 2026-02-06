export const convertStringToNumber = (string: string) => {
    const onlyNumbers = string.replace(/\D/g, "");
    const formattedValue = parseFloat(onlyNumbers);
    return formattedValue;
};
