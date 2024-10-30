export const convertStringFunc = (str: string) => {
  if (!str) return "";
  const markdownLinkRegex =
    /\[([^\]]+)\]\((https?:\/\/[^\s\)]+|mailto:[^\s\)]+|tel:[^\s\)]+)\)/g;
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/g;
  const phoneRegex = /(hotline\s+)?(\+?\d[\d\s-]{7,}\d)/g;
  return str
    .replace(markdownImageRegex, '<br><img src="$2" alt="$1" width="50"><br>')
    .replace(markdownLinkRegex, '<a href="$2" target="_blank">$1</a>')
    .replace(
      phoneRegex,
      (match, hotline, number) =>
        `${hotline || ""}<a href="tel:${number.trim()}">${number.trim()}</a>` // Giữ nguyên "hotline" và thêm thẻ a
    )
    .replace(/\n/g, "<br>")
    .replace(/\*\*\s*(.*?)\s*\*\*/g, "<strong>$1</strong>")
    .replace(/\*\s/g, "• ");
};
