export const BROKER_CONFIG = {
    fortis: {
        path: "fortis/application",
    },
    swiftdial: {
        path: "swiftdial/application",
    },
};

export type BrokerName = keyof typeof BROKER_CONFIG;
