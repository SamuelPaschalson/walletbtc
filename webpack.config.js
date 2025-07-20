const path = require("path");
// Add this at the top
process.noDeprecation = true;
module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "main.js",
  },

  target: "web",
  devServer: {
    port: "10000",
    static: ["./public"],
    host: '0.0.0.0',
    open: true,
    hot: true,
    historyApiFallback: true,
    liveReload: true,
    // Add these security-conscious settings:
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      // Add your production domain(s) here:
      'https://walletbtc.onrender.com',
      // Add your Render.com hostname when deployed:
      process.env.RENDER_EXTERNAL_HOSTNAME || ''
    ].filter(Boolean), // Removes empty strings
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|mp4|mp3|m4a|wav|m4v|jpe?g|gif|woff|woff2|eot|ttf|svg)$/i,
        use: ["file-loader"],
      },
    ],
  },
};
