const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  resolve: {
    extensions: [".ts", ".tsx"],
  },
  plugins: [
    new webpack.ProvidePlugin({
       "React": "react",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts?x$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
              ["@babel/preset-react"],
              ["@babel/preset-typescript"]
            ]
          }
        }
      }
    ]
  }
}