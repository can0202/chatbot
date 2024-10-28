export const convertStringFunc = (str: string) => {
  if (!str) return "";
  return str
    .replace(/\n/g, "<br>")
    .replace(/\*\*\s*(.*?)\s*\*\*/g, "<strong>$1</strong>")
    .replace(/\*\s/g, "• ");
};
