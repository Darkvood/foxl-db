const TerserPlugin = require("terser-webpack-plugin");
const merge = require("webpack-merge");
const NodemonPlugin = require("nodemon-webpack-plugin");

const resolve = require("path").resolve;

const mode = process.env.NODE_ENV;

// config for Node.js App
let nodeConfig = {
  mode,
  target: "node",
  entry: resolve(__dirname, "src/file.ts"),
  output: {
    path: resolve(__dirname, "dist"),
    filename: "file.js",
    library: "foxl-db",
    libraryTarget: "umd"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        use: ["ts-loader"]
      }
    ]
  },
  plugins: []
};

// production
if (mode === "production") {
  nodeConfig = merge.strategy({ optimization: "append" })(nodeConfig, {
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            }
          },
          extractComments: false
        })
      ]
    }
  });
}

// config for web app
let webConfig = merge.strategy({ entry: "replace", "output.filename": "replace" })(nodeConfig, {
  target: "web",
  entry: resolve(__dirname, "src/web.ts"),
  output: {
    filename: "web.js"
  }
});

// dev mode for Node
if (mode === "development") {
  nodeConfig = merge.strategy({ entry: "replace", plugins: "append" })(nodeConfig, {
    entry: resolve(__dirname, "dev/index.ts"),
    plugins: [new NodemonPlugin()]
  });
}

// TODO: Add dev mode for web
module.exports = mode === "production" ? [nodeConfig, webConfig] : nodeConfig;
