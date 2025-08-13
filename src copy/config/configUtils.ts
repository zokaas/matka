export const encodeToBase64 = (id: string, secret: string) => {
  if (id === "" && secret === "") return "";
  const encodedValue = Buffer.from(`${id}:${secret}`).toString("base64");
  return `Basic ${encodedValue}`;
};
