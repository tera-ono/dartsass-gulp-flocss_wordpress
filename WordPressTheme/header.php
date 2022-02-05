<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<!-- パーツ化したheadタグ -->
<?php get_template_part('includes/header/meta') ?>

<body <?php body_class(); ?>>

  <?php wp_body_open(); ?>
  <!-- パーツ化したheaderの中身 -->
  <?php get_template_part('includes/header/content') ?>