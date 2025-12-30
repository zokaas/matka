const baseUrl = process.env.REACT_APP_AUTH_REDIRECT_URL;

export async function sessionLogout() {
    const url = `${baseUrl}/logout/sweden-flex-online`;
    const token = localStorage.getItem("token");

    const result = await fetch(url, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            authorization: token as string,
        },
    });

    return result;
}
