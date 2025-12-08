export type T_StatusMessage = {
    id: number;
    code: string;
    message: string;
    locale: string;
};

export type T_StatusMessageItem = {
    message: string;
    label: string;
};

export type T_StatusMessagesData = {
    [statusCode: string]: T_StatusMessageItem;
};

export type T_StatusMessagesResponse = {
    data: {
        id: number;
        documentId: string;
        messages: T_StatusMessagesData;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        locale: string;
    };
    meta: Record<string, unknown>;
};