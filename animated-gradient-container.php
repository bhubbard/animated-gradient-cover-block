<?php
/**
 * Plugin Name:       Animated Gradient Container
 * Description:       Create stunning animated gradient backgrounds with customizable color schemes, animations, and accessibility controls.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            WordPress Telex
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       animated-gradient-container-block-wp
 *
 * @package AnimatedGradientContainer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function animated_gradient_container_animated_gradient_container_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'animated_gradient_container_animated_gradient_container_block_init' );
