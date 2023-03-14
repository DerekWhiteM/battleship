import path from 'path';
import webpack from 'webpack';

export default {
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
        test: /\.tsx?$/,
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
};