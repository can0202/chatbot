const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // File JS đầu vào của bạn
  output: {
    filename: "vars-chatbot.js", // File JS đầu ra sau khi build
    path: path.resolve(__dirname, "dist"),
    clean: true, // Dọn dẹp thư mục đầu ra trước khi tạo mới
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"], // Thêm phần mở rộng của TypeScript và JSX
  },
  mode: "development", // Hoặc 'production' nếu bạn muốn build cho môi trường production
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Xử lý các file TypeScript (.ts, .tsx)
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Xử lý file CSS
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/, // Xử lý file SCSS
        use: ["style-loader", "css-loader", "sass-loader"], // Thêm sass-loader để xử lý SCSS
      },
      {
        test: /\.(png|jpg|gif|svg)$/, // Xử lý các file hình ảnh và SVG
        type: "asset", // Hoặc bạn có thể sử dụng 'file-loader' nếu cần
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024, // Chuyển đổi file dưới 8KB thành base64
          },
        },
      },
    ],
  },
};
