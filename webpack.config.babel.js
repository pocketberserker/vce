import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import VueLoaderPlugin from "vue-loader/lib/plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const src = path.join(__dirname, "src");
const dist = path.join(__dirname, "dist");

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";
const manifest =
  mode === "production" ? "manifest.prod.json" : "manifest.dev.json";

const config = {
  entry: {
    content: path.join(src, "content"),
    popup: path.join(src, "popup")
  },
  mode,
  output: {
    path: dist,
    filename: "js/[name].bundle.js"
  },
  target: "web",
  resolve: {
    extensions: [".js", ".vue", ".json"],
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  devServer: {
    contentBase: dist,
    port: 9000,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {loader: "babel-loader"}
      },
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(src, manifest),
        to: path.join(dist, "manifest.json")
      }
    ]),
    new HtmlWebpackPlugin({
      chunks: ["popup"],
      title: "popup",
      filename: path.join(dist, "popup.html"),
      template: path.join(src, "page.ejs")
    })
  ]
};

if (mode === "development") {
  config.devtool = "inline-source-map";
} else {
  config.plugins.push(new CleanWebpackPlugin([dist]));
}

module.exports = config;
