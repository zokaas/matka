export const createWalkerIcon = (): string => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="42" height="42">
      <circle cx="12" cy="6" r="4" fill="#e91e63"/>
      <path d="M16,15L13,21L11,14L9,18H7L10,12C10,12 10.8,10 12,10C13.5,10 16,12 16,12L19,19H17L16,15Z" fill="#e91e63"/>
    </svg>
  `;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
};
