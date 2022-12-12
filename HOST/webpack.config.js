const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
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

        resolve: {
          extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
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

            new ModuleFederationPlugin({
              name: "host",
              filename: "remoteEntry.js",
              remotes: {
                "nav": "nav@http://localhost:3002/remoteEntry.js",
              },
              exposes: {},
              shared: {
                ...deps,
                react: {
                  singleton: true,
                  requiredVersion: deps.react,
                },
                "react-dom": {
                  singleton: true,
                  requiredVersion: deps["react-dom"],
                },
              },
            }),
        ],


        devServer: {
            port: 3001,
            open: true,
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
        },
    }
}