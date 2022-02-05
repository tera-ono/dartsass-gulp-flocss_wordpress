# 【DartSass】Gulp環境
# FLOCSS設計（スマホファースト）
# WordPress仕様

## 環境
- Gulpが使える環境が前提（4系）
- Nodeはバージョン14以降

## 使い方
- ダウンロードしたフォルダを開く
- ターミナルを開き、 npm i とコマンドを入力
- node_modulesとpackage-lock.jsonが生成されるのを確認する
- 「 npx gulp 」とコマンドを入力すると動き出します

## 仕様
- sassの記述はsassの中で行う
- 画像はassetフォルダのimagesの中に格納する（圧縮していないです、ワードプレスのプラグインで圧縮予定）
- コンパイルされたCSSは第一階層のCSSフォルダの中に出力されます。
- jsに関する記述は第一階層のjsフォルダの中で行ってください。特に圧縮等は行っていません。

## 備考
- スマホファーストが前提の仕様です。
- rem記述を前提としています。
- ルートフォントをvwで設定していることからPCサイズのレイアウトをタブレットで表示させることが出来ます（remで書いた場合のみ）。
# dartsass-gulp-flocss-WordPress
# dartsass-gulp-flocss_wordpress
