export const convertStringFunc = (str: string) => {
  if (!str) return "";
  const markdownLinkRegex =
    /\[([^\]]+)\]\((https?:\/\/[^\s\)]+|mailto:[^\s\)]+|tel:[^\s\)]+)\)/g;
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^\s\)]+)\)/g;
  const phoneRegex = /(hotline\s+)?(\+?\d[\d\s-]{7,}\d)/g;
  const tableRegex =
    /(\|.*?\|(?:\n|<br>)(?:\|[-:|\s]+\|(?:\n|<br>)(?:\|.*?\|(?:\n|<br>)?)+))/g;

  const convertTable = (tableMarkdown: string) => {
    // Tách các hàng trong bảng
    const rows = tableMarkdown
      .replace(/<br>/g, "\n") // Thay thế <br> thành ký tự xuống dòng để xử lý
      .trim()
      .split("\n");

    // Lấy tiêu đề từ hàng đầu tiên
    const headerCells = rows[0]
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    const bodyRows = rows.slice(2).map((row) =>
      row
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim())
    );

    // Tạo HTML cho bảng
    let tableHTML =
      "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    tableHTML += "<thead><tr>";

    headerCells.forEach((header) => {
      tableHTML += `<th style="padding: 8px; border: 1px solid #ddd;">${header}</th>`;
    });

    tableHTML += "</tr></thead><tbody>";

    // Tạo các hàng cho tbody
    bodyRows.forEach((rowCells) => {
      tableHTML += "<tr>";
      rowCells.forEach((cell) => {
        tableHTML += `<td style="padding: 8px; border: 1px solid #ddd;">${
          cell || ""
        }</td>`;
      });
      tableHTML += "</tr>";
    });

    tableHTML += "</tbody></table>";
    return tableHTML;
  };

  return str
    .replace(markdownImageRegex, '<br><img src="$2" alt="$1" width="50"><br>')
    .replace(markdownLinkRegex, '<a href="$2" target="_blank">$1</a>')
    .replace(
      phoneRegex,
      (match, hotline, number) =>
        `${hotline || ""}<a href="tel:${number.trim()}">${number.trim()}</a>` // Giữ nguyên "hotline" và thêm thẻ a
    )
    .replace(tableRegex, convertTable)
    .replace(/\n/g, "<br>")
    .replace(/\*\*\s*(.*?)\s*\*\*/g, "<strong>$1</strong>")
    .replace(/\*\s/g, "• ");
};
