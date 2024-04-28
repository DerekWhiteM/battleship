import path from 'path';
import webpack from 'webpack';

export default {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname),
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