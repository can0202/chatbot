const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

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
  mode: "production", // Hoặc 'production' nếu bạn muốn build cho môi trường production
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
            maxSize: 100 * 1024, // Chuyển đổi file dưới 100KB thành base64
          },
        },
      },
    ],
  },
  plugins: [
    new Dotenv(), // Tự động tải các biến môi trường từ file .env
    new webpack.DefinePlugin({
      "process.env.REACT_APP_BOTID": JSON.stringify(
        process.env.REACT_APP_BOTID
      ),
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL
      ),
      "process.env.REACT_APP_CMS_URL": JSON.stringify(
        process.env.REACT_APP_CMS_URL
      ),
    }),
  ],
};
