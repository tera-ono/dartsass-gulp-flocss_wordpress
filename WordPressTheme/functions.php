<?php
/**
 * Functions
 */

/**
 * WordPress標準機能
 *
 * @codex https://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/add_theme_support
 */
function my_setup() {
	add_theme_support( 'post-thumbnails' ); /* アイキャッチ */
	add_theme_support( 'automatic-feed-links' ); /* RSSフィード */
	add_theme_support( 'title-tag' ); /* タイトルタグ自動生成 */
	add_theme_support(
		'html5',
		array( /* HTML5のタグで出力 */
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		)
	);
}
add_action( 'after_setup_theme', 'my_setup' );



/**
 * CSSとJavaScriptの読み込み(get_theme_file_pathで自動キャッシュクリア)
 *
 * @codex https://wpdocs.osdn.jp/%E3%83%8A%E3%83%93%E3%82%B2%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%83%A1%E3%83%8B%E3%83%A5%E3%83%BC
 */
function my_script_init()
{
	wp_enqueue_style('my', get_theme_file_uri('/assets/css/style.css'), array(), filemtime(get_theme_file_path('/assets/css/style.css')), 'all');
	
	/* --- swiper用 --- */
	wp_enqueue_script('mv-swiper', get_theme_file_uri('/assets/js/mv_slider.js'), array(), get_theme_file_path('/assets/js/mv_slider.js'), true );
	/* --- オリジナルjs --- */
	wp_enqueue_script('my', get_theme_file_uri('/assets/js/script.js'), array(), get_theme_file_path('/assets/js/script.js'), true );
}
add_action('wp_enqueue_scripts', 'my_script_init');


/**
 * カテゴリー名とターム名を1つだけ表示（aタグリンクも出しわけ）[引数デフォルト: カテゴリー]
 *
 * @param boolean $anchor aタグで出力するかどうか.
 * @param string  $taxonomy タクソノミー:初期値はデフォルトの投稿で使うcategory。 カスタム投稿の場合はそのタクソノミーを指定
 * @param integer $id 投稿id.
 * @return void
 */
function my_the_post_terms($anchor = false, $taxonomy = 'category', $id = 0)
{
  global $post;
  //引数が渡されなければ投稿IDを見るように設定
  if (0 === $id) {
    $id = $post->ID;
  }

  //ターム(カテゴリー)一覧を取得
  /* --- もし、taxonomy.php or category.phpだったら現在表示中のターム(カテゴリ)情報を取得 --- */
  if(is_tax() || is_category()) {
    $this_terms = get_queried_object();
    if ($this_terms) {
      if ($anchor) { //引数がtrueなら個別投稿記事リンク付きで出力
  
        echo '<a href="' . get_the_permalink() . '">' . esc_html($this_terms->name) . '</a>';
      } else { //引数がfalseならカテゴリー名のみ出力
        echo esc_html($this_terms->name);
      }
    }
  } else { /* --- それ以外、つまりその他のアーカイブページ:
						home.php(デフォルト投稿一覧), archive-〇〇.php(カスタム投稿一覧)のターム(カテゴリ)情報を取得 --- */
    $this_terms = get_the_terms($id, $taxonomy);
    if ($this_terms[0]) {
      if ($anchor) { //引数がtrueならアーカイブへのリンク付きで出力
  
        echo '<a href="' . esc_url(get_term_link($this_terms[0]->term_id)) . '">' . esc_html($this_terms[0]->name) . '</a>';
      } else { //引数がfalseならカテゴリー名のみ出力
        echo esc_html($this_terms[0]->name);
      }
    } 
  }
}


/**
 * メニューの登録
 *
 * @codex https://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/register_nav_menus
 */
// function my_menu_init() {
// 	register_nav_menus(
// 		array(
// 			'global'  => 'ヘッダーメニュー',
// 			'utility' => 'ユーティリティメニュー',
// 			'drawer'  => 'ドロワーメニュー',
// 		)
// 	);
// }
// add_action( 'init', 'my_menu_init' );
/**
 * メニューの登録
 *
 * 参考：https://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/register_nav_menus
 */


/**
 * ウィジェットの登録
 *
 * @codex http://wpdocs.osdn.jp/%E9%96%A2%E6%95%B0%E3%83%AA%E3%83%95%E3%82%A1%E3%83%AC%E3%83%B3%E3%82%B9/register_sidebar
 */
// function my_widget_init() {
// 	register_sidebar(
// 		array(
// 			'name'          => 'サイドバー',
// 			'id'            => 'sidebar',
// 			'before_widget' => '<div id="%1$s" class="p-widget %2$s">',
// 			'after_widget'  => '</div>',
// 			'before_title'  => '<div class="p-widget__title">',
// 			'after_title'   => '</div>',
// 		)
// 	);
// }
// add_action( 'widgets_init', 'my_widget_init' );


/**
 * アーカイブタイトル書き換え
 *
 * @param string $title 書き換え前のタイトル.
 * @return string $title 書き換え後のタイトル.
 */
function my_archive_title( $title ) {

	if ( is_home() ) { /* ホームの場合 */
		$title = 'ブログ';
	} elseif ( is_category() ) { /* カテゴリーアーカイブの場合 */
		$title = '' . single_cat_title( '', false ) . '';
	} elseif ( is_tag() ) { /* タグアーカイブの場合 */
		$title = '' . single_tag_title( '', false ) . '';
	} elseif ( is_post_type_archive() ) { /* 投稿タイプのアーカイブの場合 */
		$title = '' . post_type_archive_title( '', false ) . '';
	} elseif ( is_tax() ) { /* タームアーカイブの場合 */
		$title = '' . single_term_title( '', false );
	} elseif ( is_search() ) { /* 検索結果アーカイブの場合 */
		$title = '「' . esc_html( get_query_var( 's' ) ) . '」の検索結果';
	} elseif ( is_author() ) { /* 作者アーカイブの場合 */
		$title = '' . get_the_author() . '';
	} elseif ( is_date() ) { /* 日付アーカイブの場合 */
		$title = '';
		if ( get_query_var( 'year' ) ) {
			$title .= get_query_var( 'year' ) . '年';
		}
		if ( get_query_var( 'monthnum' ) ) {
			$title .= get_query_var( 'monthnum' ) . '月';
		}
		if ( get_query_var( 'day' ) ) {
			$title .= get_query_var( 'day' ) . '日';
		}
	}
	return $title;
};
add_filter( 'get_the_archive_title', 'my_archive_title' );


/**
 * 抜粋文の文字数の変更
 *
 * @param int $length 変更前の文字数.
 * @return int $length 変更後の文字数.
 */
function my_excerpt_length( $length ) {
	return 80;
}
add_filter( 'excerpt_length', 'my_excerpt_length', 999 );


/**
 * 抜粋文の省略記法の変更
 *
 * @param string $more 変更前の省略記法.
 * @return string $more 変更後の省略記法.
 */
function my_excerpt_more( $more ) {
	return '...';

}
add_filter( 'excerpt_more', 'my_excerpt_more' );



/**
 * それぞれのテンプレートファイルのメインループを制御して、1度に出力する数などを変更(残りの投稿は次のページに〜)
 */
// function my_preget_posts($query)
// {
// 	//管理画面を表示しているとき、もしくは現在のクエリがメインクエリでなければ動作をキャンセルする
// 	//トップページを固定ページで設定しているので、front-page.phpでは使えない
// 	if (is_admin() || !$query->is_main_query()) {
// 		return;
// 	}
// 	/* --- カスタム投稿タイプ 制作実績 もしくは、タクソノミー制作ジャンルで６件表示 --- */
// 	if ($query->is_post_type_archive('works') || ($query->is_tax('work_genre'))) {
// 		$query->set('posts_per_page', 6);
// 	}
//  /* --- カスタム投稿タイプ ブログ もしくは、タクソノミー: ブログカテゴリーで9件表示 --- */
// 	if ($query->is_post_type_archive('blog') || ($query->is_tax('blog_category'))) {
// 		$query->set('posts_per_page', 9);
// 	}
// }
// add_action('pre_get_posts', 'my_preget_posts');
