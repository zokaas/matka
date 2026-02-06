export type T_AttachmentData = {
    dataUrl: string;
    name: string;
    type: string;
    size: number;
};
export function fileToBase64(file: Blob): Promise<string> {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort();
            reject(new Error("Problem reading file"));
        };

        reader.onload = () => resolve(reader.result as string);
    });
}

export async function getFileFromDataUrl(url: string): Promise<string> {
    const blob = await fetch(url).then((r) => r.blob());
    const blobTobase64 = await fileToBase64(blob).then((data) => data);

    return Promise.resolve(blobTobase64);
}

const getAttachmentsData = async (data: T_AttachmentData[]) => {
    const attachmentWithData = await Promise.all(
        data.map(async (attachment) => {
            const fileContent = await getFileFromDataUrl(attachment.dataUrl);
            return {
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
                data: fileContent,
            };
        })
    );

    return attachmentWithData;
};
