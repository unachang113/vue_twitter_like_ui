// モード値を production に設定すると最適化された状態で、
// development に設定するとソースマップ有効でJSファイルが出力される
const MODE = "development";
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: MODE,
  // source-map 方式でないと、CSSの元ソースが追跡できないため
  devtool: 'source-map',
  entry: path.join(__dirname, '/src'),
  // ファイルの出力設定
  output: {
    // 出力ファイル名
    filename: 'main.js',
    // 出力ファイルのディレクトリ名
    path: path.resolve(__dirname, 'dist')
  },
  // ローカル開発用環境を立ち上げる
  // 実行時にブラウザが自動的に localhost を開く
  devServer: {
    contentBase: 'dist',
    open: true
  },
  // ローダーの設定
  module: {
    rules: [
      //sassの読み込みとコンパイル
      {
        // 対象ファイルの拡張子
        test: /\.scss/,
        // ファイル書き出し
        use: ExtractTextPlugin.extract({
          use: [
            // CSSをバンドルするための機能
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                // オプションでCSS内のurl()メソッドの取り込みを禁止する
                url: false,
                // ソースマップの利用有無
                sourceMap: true,
                // 空白文字やコメントを削除する
                minimize: true,
                // 2 => postcss-loader, sass-loader
                importLoaders: 2,
              },
            },
            // PostCSSのための設定
            {
              loader: 'postcss-loader',
              options: {
                // PostCSS側でもソースマップを有効にする
                sourceMap: true,
                plugins: [
                  // Autoprefixerを有効化
                  // ベンダープレフィックスを自動付与する
                  require('autoprefixer')({grid: true})
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                // ソースマップの利用有無
                sourceMap: true,
              }
            }
          ],
        }),
      },
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|eot|wof|woff|woff2|ttf|svg)$/,
        // 画像をBase64として取り込む
        loader: 'url-loader'
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('css/application.css'),
  ],
};