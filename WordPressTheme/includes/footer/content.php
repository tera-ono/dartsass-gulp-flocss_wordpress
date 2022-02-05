<!-- フッターの中身 -->
<footer class="l-footer p-footer">

  <div class="p-footer__inner l-inner">
    <nav class="p-footer__nav c-footer-nav">
      <?php
      wp_nav_menu(
        array(
          'depth' => 1,
          'theme_location' => 'global', //グローバルメニューをここに表示すると指定
          'container' => false,
          'menu_class' => 'c-footer-nav__items', //ulのクラス
        )
      );
      ?>
    </nav>
  </div>
</footer>