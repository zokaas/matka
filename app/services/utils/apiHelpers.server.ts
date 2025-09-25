export const handleFetchResponse = async (response: Response) => {
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(`Request failed with status ${response.status}`);
    }
    //NOTE: is this something that should be done in api-nestjs-monorepo?
    const responseText = await response.text();

    try {
        return JSON.parse(responseText);
    } catch {
        const fixedJson = responseText.replace(/,(\s*[}\]])/g, "$1");
        return JSON.parse(fixedJson);
    }
};

export const getRequest = async <T>(url: string, authToken: string): Promise<T> => {
    const method = "GET";
    const headers = new Headers({
        "Content-Type": "application/json",
        authorization: authToken,
    });

    const options: RequestInit = {
        method,
        headers,
    };

    try {
        const response = await fetch(url, options);
        return await handleFetchResponse(response);
    } catch (error) {
        console.error(`Error with request to ${url}:`, error);
        throw new Error("API request failed");
    }
};

export const postRequest = async <T, B>(url: string, authToken: string, data: B): Promise<T> => {
    const method = "POST";
    const headers = new Headers({
        "Content-Type": "application/json",
        authorization: authToken,
    });

    const options: RequestInit = {
        method,
        headers,
        ...(data ? { body: JSON.stringify(data) } : {}),
    };

    try {
        const response = await fetch(url, options);
        return await handleFetchResponse(response);
    } catch (error) {
        console.error(`Error with request to ${url}:`, error);
        throw new Error("API request failed");
    }
};
