export function cleanLocalStorage(): void {
    localStorage.removeItem("id");
    localStorage.removeItem("company-info");
    localStorage.removeItem("applicationUuid");
    localStorage.removeItem("reloads");
}
