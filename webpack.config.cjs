const path = require('path');

module.exports = {
  entry: './src/frontend/src/main.tsx',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist/frontend'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/frontend/src'),
    },
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              jsx: 'react-jsx'
            }
          }
        }, 
        exclude: /node_modules/ 
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|jpg|gif|svg)$/, use: ['file-loader'] },
    ],
  },

  devServer: {
    static: './dist',
    port: 3000,
  },
};
