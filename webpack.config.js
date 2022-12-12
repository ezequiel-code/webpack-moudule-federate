const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
let eslintPlugin = null;

function getEslintPlugin(args) {
    if (eslintPlugin === null) {
      const options = {
        fix: false,
        failOnWarning: false,
        extensions: ['js', 'jsx', 'ts', 'tsx'],
      };
      if (args && args.mode) {
        options.failOnWarning = args.mode === 'production';
      }
      if (args && args.env && args.env.fix) {
        options.fix = true;
      }
      eslintPlugin = new ESLintPlugin(options);
    }
    return eslintPlugin;
  }


module.exports = (env, args) => {
    return {
        devtool: args.mode === 'production' ? undefined : 'eval-source-map',
        entry: path.join(__dirname, 'src', 'index.tsx'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[fullhash].js',
            chunkFilename: '[name].[chunkhash].js',
            clean: true,
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    resolve: {
                        extensions: ['.ts', '.tsx', '.js', '.json'],
                    },
                    use: 'ts-loader',
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader",
                    ],
                },
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "src", "index.html"),
            }),
            getEslintPlugin(args),
        ],


        devServer: {
            port: 3002,
            open: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
              cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                      // get the name. E.g. node_modules/packageName/not/this/part.js
                      // or node_modules/packageName
                      const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          
                      // npm package names are URL-safe, but some servers don't like @ symbols
                      return `npm.${packageName.replace('@', '')}`;
                    },
                  },
              },
            },
          },
    }
}