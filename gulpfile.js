const { src, dest, watch, series, parallel } = require("gulp");

// 共通
const rename = require("gulp-rename");


const themeName = "WordPressTheme"; // WordPress theme name(開発テーマ名に都度変更:テーマフォルダ名)

// 読み込み先（階層が間違えていると動かないので注意）
const srcPath = {
    css: './sass/**/*.scss',
    // img: 'src/images/**/*',
    php: `./${themeName}/**/*.php`, //includesフォルダも含めたphpファイル
}

// 吐き出し先（なければ生成される）
const destPath = {
    css: `./${themeName}/assets/css`,
    // img: `./${themeName}/assets/images`,
}

// ブラウザーシンク（リアルタイムでブラウザに反映させる処理）
const browserSync = require("browser-sync").create();
const browserSyncOption = {
    proxy: "aaa.local",       // ローカルにある「Site Domain」に合わせる
    notify: false,                  // ブラウザ更新時に出てくる通知を非表示にする
    open: "external",  // ローカルIPアドレスでサーバを立ち上げる

}
const browserSyncFunc = () => {
    browserSync.init(browserSyncOption); //ファイル(今回はphp)を設定してローカルサーバー立ち上げてリロード
}
const browserSyncReload = (done) => { //自動リロード
    browserSync.reload();
    done(); //これが無いと自動でリロードされない
}

// Sassファイルのコンパイル処理（DartSass対応）
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob-use-forward');
const plumber = require("gulp-plumber");// エラーが発生しても強制終了させない
const notify = require("gulp-notify");//エラー発生時のアラート出力
const postcss = require("gulp-postcss");//postcss-cssnext,css-mqpackerを使うために必要
const cssnext = require("postcss-cssnext")//最新のCSS構文を今すぐ使えるようにする
const cleanCSS = require("gulp-clean-css");//CSSを圧縮する
const sourcemaps = require("gulp-sourcemaps");//ソースマップを生成する

//ベンダープレフィックスを付与する条件(対象ブラウザ)
const browsers = [
    'last 2 versions', //各ブラウザの最後の2つのバージョン
    '> 5%', //世界のシェア5%以上のブラウザに対応
    // 'ie = 11', //IE11
    // 'not ie <= 10', //IE10未満を除く
    'ios >= 8', //iOSのSafariのバージョン8以上
    'and_chr >= 5', // Chrome for Android 5以上
    'Android >= 5', //Android5以上
]

/* --- scssファイルを指定のブラウザに対応したcssにコンパイルして 指定した場所(cssフォルダ)に出力するメソッド--- */
const cssSass = () => {
    return src(srcPath.css)//コンパイル元
        .pipe(sourcemaps.init())//ソースマップを初期化
        .pipe(
            plumber({
                errorHandler: notify.onError('Error:<%= error.message %>')//コンパイルエラー時メッセージ表示
            }))
        .pipe(sassGlob())

        //同期レンダリングsass.sync()の方が、非同期レンダリングsass()の2倍早い
        .pipe(sass.sync({ 
            includePaths: ['sass'], //ルートディレクトリをincludePathsで指定しておくと、@useの後の相対パスを省略できます。
            outputStyle: 'expanded'//一般的なCSSのフォーマットで出力される (compressedなら圧縮されて出力)
        }))
        .pipe(postcss([cssnext(browsers)])) //指定したブラウザに対応した次世代のCSSを、モダンな環境にも対応できるように書き換える
        // .pipe(sourcemaps.write('./map'))//cssファイルから見たパス(同階層)
        .pipe(dest(destPath.css))
        .pipe(cleanCSS())
		.pipe(rename({ extname: '.min.css' }))//圧縮したcssをリネーム
        .pipe(sourcemaps.write('./map'))//cssファイルから見たパス(同階層)
        .pipe(dest(destPath.css)) //pipeされたものを、ファイルに書き出します
        .pipe(browserSync.stream())//ブラウザがリロードしていないのに変更内容が反映させる
        .pipe(notify({
            message: 'コンパイル出来たよ！',//コンパイル成功時:文字は好きなものに変更してね！
            onLast: true //trueにすると最後にコンパイルされたファイル名だけ表示, falseだと前ファイル名が出て邪魔
        }))
}

// // 画像圧縮 変数宣言
// const imagemin = require("gulp-imagemin"); //画像圧縮
// const imageminMozjpeg = require("imagemin-mozjpeg"); //jpg圧縮
// const imageminPngquant = require("imagemin-pngquant"); //png圧縮
// const imageminSvgo = require("imagemin-svgo"); //svg圧縮

// /* --- 画像圧縮して指定の場所に出力するメソッド --- */
// const imgImagemin = () => {
//     return src(srcPath.img)
//     .pipe(imagemin([ //オプション追加
//         imageminMozjpeg({quality: 80}), //jpg圧縮率(品質)80％ {85が最適との記事も}
//         imageminPngquant(),
//         imageminSvgo({plugins: [{removeViewbox: false}]}) // true:viewBox属性を削除する（widthとheight属性がある場合）。false: 表示が崩れる原因になるので削除しない。
//         ],
//         {
//             verbose: true //処理したすべての画像のログをターミナルに出力してくれます。falseなら全体で何枚処理してどのくらい削減できたか、の結果だけだったはず
//         }
//     ))
//     .pipe(dest(destPath.img))
// }


// ファイルの変更を検知
const watchFiles = () => {
    watch(srcPath.css, series(cssSass, browserSyncReload)) // src/sassフォルダ内の変更があったらcssにコンパイルして自動リロード
    // watch(srcPath.img, series(imgImagemin, browserSyncReload)) // src/imagesフォルダ内の変更があったら画像圧縮して自動リロード
    watch(srcPath.php, series(browserSyncReload)) //phpファイルに変更があったら自動リロード
}

// 画像だけ削除
const del = require('del');
const delPath = {
    // css: '../dist/css/',
    // js: '../dist/js/script.js',
    // jsMin: '../dist/js/script.min.js',
    // img: './images/',
    // html: '../dist/*.html',
    wpcss: `./${themeName}/assets/css/**`,
    // wpjs: `../${themeName}/assets/js/script.js`,
    // wpjsMin: `../${themeName}/assets/js/script.min.js`,
    // wpImg: `../${themeName}/assets/images/`
}

const clean = (done) => {
    // del(delPath.img, { force: true, }); //カレントディレクトリ(同じ階層)以上を対象にするならtrue
    
    // del(delPath.css, { force: true, });
    // del(delPath.js, { force: true, });
    // del(delPath.jsMin, { force: true, });
    // del(delPath.html, { force: true, });
    del(delPath.wpcss, { force: true, });
    // del(delPath.wpjs, { force: true, });
    // del(delPath.wpjsMin, { force: true, });
    // del(delPath.wpImg, { force: true, });
    done();
};


// npx gulpで出力する内容 （gulpコマンドで実行できるように設定）
//(画像を間違って入れてしまった時など、読み込んでしまった不要な画像を消してからcontrol+cでgulpを解除してもう1度 npx gulpを実行すると出力された画像は自動で削除される: cleanメソッド)
/**
 * seriesは「順番」に実行
 * parallelは並列で実行 
 */
/* --- watchFilesメソッドで使われている"gulp.watch"メソッドは1度呼び出すと Gulp がずっと実行された状態になります。 なので、監視ファイルが変更されるたびにwatchFilesメソッドが実行され自動でリロードされる仕組み--- */

exports.default = series(series(clean, cssSass), parallel(watchFiles, browserSyncFunc));

//series:順番に処理 series(clean, cssSass, imgImagemin)を処理してからparallel(watchFiles, browserSyncFunc))を開始してparallel内のwatchFiles, browserSyncFuncを同時進行で処理する

//順番的に 1.default実行→2.cleanで指定したパス(./images/)の中を削除→3.srcフォルダ内のsassフォルダの_scssファイルをコンパイルし,cssフォルダに出力→ 4.imgImagemin()で画像圧縮してimagesフォルダに出力  が終わったら 5.『監視ファイルの変更(_scss,画像,HTML)があったらcssへコンパイル,画像圧縮,変更後のHTMLをブラウザにリローデッド & ファイル(今回はhtml)を設定してローカルサーバー立ち上げてリロード』 

/* --- *重要* 5のparallelで"watchFilesを同時にbrowserSyncFunc"に実行しないとリロードされない！！ 
例えば、5をseriesにしてwatchFilesが完了してからbrowserSyncFuncを実行しようとしても、そもそもサーバーが立ち上がらない為、cssにコンパイルは出来るがブラウザにリロードは出来ない！！
また、順番を逆にすると、サーバーが立ち上がるがファイルの変更を変更を監視出来ていない為、画像圧縮もcssコンパイルのリロードが出来ないので、何も変化が無い状態になる。
--- */




// npx gulp del → 画像最適化（重複を削除）
// exports.del = series(series(clean, cssSass, imgImagemin), parallel(watchFiles, browserSyncFunc));
