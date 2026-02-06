export const isKYCServiceEnabled = (): boolean => {
    return Number(import.meta.env.VITE_ACTIVE_KYC_SERVICE) === 1;
};
