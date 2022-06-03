// alert('hello');

jQuery(function ($) { // この中であればWordpressでも「$」が使用可能になる

  // スムーススクロール (絶対パスのリンク先が現在のページであった場合でも作動)

  $(document).on('click', 'a[href*="#"]', function () {
    let time = 400;
    let header = $('header').innerHeight();
    let target = $(this.hash);
    if (!target.length) return;
    let targetY = target.offset().top - header;
    $('html,body').animate({ scrollTop: targetY }, time, 'swing');
    return false;
  });

  /*******************************************
スクロールトップボタン
MV以下になると表れ以下追従
*******************************************/

  //  ヘッダーの高さ
 var header_height = $('.js-header').innerHeight();
 //  MVの高さ
  var mv_height = $('.js-mv').innerHeight();
  //  ヘッダーの下端がMVの下端に重なった時の高さ
  // つまり、ヘッダーでMVが隠れた時の高さ
  var target = mv_height - header_height;
  var scroll_top = $('.js-scroll-top');
  // 最初はボタンを消しておく
  scroll_top.hide();

  // スクロールトップボタンの表示設定
  $(window).scroll(function () {
    if ($(this).scrollTop() > target) {
      // MVの高さ以上のスクロールでボタンを表示
      scroll_top.fadeIn();
    } else {
      // 画面がMVの高さより上ならボタンを非表示
      scroll_top.fadeOut();
    }
  });

  // ボタンをクリックしたらスクロールして上に戻る
  scroll_top.click(function () {
    $('body,html').animate({
      scrollTop: 0
    }, 400, 'swing');
    return false;
  });



  /*******************************************
・ハンバーガーメニューをクリックすると"is-open"クラスがトグルされる

・モーダルメニューの背景をクリックしても"is-open"クラスは外されモーダル解除
*******************************************/
  $('.js-mobile-menu').on('click', function() {
    $(this).toggleClass('is-open');
    $('.js-header__menu').toggleClass('is-open');
    // bodyにis-openクラスをトグルし、css overflow: hiddenを付け外ししてスクロールを禁止、解除させる
    $('body').toggleClass('is-open');
  });

  $('.js-header__menu').on('click', function() {
    $(this).removeClass('is-open');
    $('.js-mobile-menu').removeClass('is-open');
    $('body').removeClass('is-open');
  });


  //  ヘッダーの高さ
 var header_height = $('.js-header').innerHeight();
 //  MVの高さ
  var mv_height = $('.js-mv').innerHeight();
 //  ヘッダーの下端がMVの下端に重なった時の高さ
  var target = mv_height - header_height;
 //  console.log(target);
   $(window).scroll(function() {
     
     if($(this).scrollTop() > target) {
       $('.js-header').addClass('is-opacity');
     } else {
       $('.js-header').removeClass('is-opacity');
     }
   });

});
