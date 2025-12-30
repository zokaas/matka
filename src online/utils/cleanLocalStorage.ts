export function cleanLocalStorage(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("smeId");
}
