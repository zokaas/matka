const loanAmounts = [
    30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
    750, 800, 850, 900, 950, 1000,
];

const loanPurpose = [
    "Köpa utrustning",
    "Anställa personal",
    "Finansiera skuld",
    "Marknadsföring",
    "Inköp av inventarier",
    "Oväntad utgift",
    "Expansion",
    "Betala leverantörsfakturor",
    "Annat",
];

export const amountOptions = loanAmounts.map((item: number) => {
    return {
        value: `${item} 000`,
        label: item === 1000 ? "1 000 000 kr" : `${item.toString()} 000 kr`,
    };
});

export const paymentTimeOptions = (amount: string) => {
    const paymentTime = Number(amount.replace(/\s/g, "")) <= 40000 ? [6, 12] : [6, 12, 18, 24];
    const options = paymentTime.map((item: number) => {
        return {
            value: `${item.toString()} månader`,
            label: `${item.toString()} månader`,
        };
    });
    return options;
};

export const loanPurposeOptions = loanPurpose.map((item: string) => {
    return {
        value: item,
        label: item,
    };
});
