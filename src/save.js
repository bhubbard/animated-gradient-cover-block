/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Gradient schemes configuration
 */
const GRADIENT_SCHEMES = {
	sunset: ['#ff9a56', '#ff6b95', '#c44569', '#f8b500'],
	ocean: ['#005c98', '#339dcc', '#62d2a2', '#1dd3b0'],
	forest: ['#2d5016', '#61892f', '#86c232', '#6b6e70'],
	cosmic: ['#1a1a2e', '#16213e', '#0f4c75', '#3282b8'],
	rainbow: ['#ff0844', '#ffb199', '#ffd23f', '#3bceac', '#0ead69']
};

/**
 * Speed settings
 */
const SPEED_SETTINGS = {
	slow: '8s',
	medium: '4s',
	fast: '2s'
};

/**
 * Generate gradient CSS based on scheme and animation
 */
function generateGradientCSS(scheme, animationType, speed, isPaused, blendMode) {
	const colors = GRADIENT_SCHEMES[scheme] || GRADIENT_SCHEMES.sunset;
	const duration = SPEED_SETTINGS[speed] || SPEED_SETTINGS.medium;
	
	let background = '';
	let animation = '';
	let backgroundSize = '';
	
	switch (animationType) {
		case 'horizontal':
			background = `linear-gradient(-45deg, ${colors.join(', ')})`;
			backgroundSize = '400% 400%';
			animation = `agc-horizontal ${duration} ease-in-out infinite`;
			break;
		case 'radial':
			background = `radial-gradient(circle, ${colors.join(', ')})`;
			animation = `agc-radial ${duration} ease-in-out infinite`;
			break;
		case 'diagonal':
			background = `linear-gradient(45deg, ${colors.join(', ')})`;
			backgroundSize = '400% 400%';
			animation = `agc-diagonal ${duration} ease-in-out infinite`;
			break;
		case 'rotation':
			background = `conic-gradient(${colors.join(', ')})`;
			animation = `agc-rotation ${duration} linear infinite`;
			break;
		default:
			background = `linear-gradient(-45deg, ${colors.join(', ')})`;
			backgroundSize = '400% 400%';
			animation = `agc-horizontal ${duration} ease-in-out infinite`;
	}
	
	if (isPaused) {
		animation += ' paused';
	}
	
	const styles = {
		background,
		animation,
		mixBlendMode: blendMode !== 'normal' ? blendMode : undefined
	};
	
	if (backgroundSize) {
		styles.backgroundSize = backgroundSize;
	}
	
	return styles;
}

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const {
		gradientScheme = 'sunset',
		animationType = 'horizontal',
		animationSpeed = 'medium',
		isPaused = false,
		minHeight = 400,
		blendMode = 'normal',
		respectMotionPreference = true
	} = attributes;

	const gradientStyles = generateGradientCSS(
		gradientScheme,
		animationType,
		animationSpeed,
		isPaused,
		blendMode
	);

	const containerStyles = {
		...gradientStyles,
		minHeight: `${minHeight}px`,
		position: 'relative',
		overflow: 'hidden'
	};

	const classes = ['wp-block-telex-block-animated-gradient-container'];
	if (respectMotionPreference) {
		classes.push('agc-respect-motion');
	}

	const blockProps = useBlockProps.save({
		style: containerStyles,
		className: classes.join(' '),
		'data-gradient-scheme': gradientScheme,
		'data-animation-type': animationType,
		'data-animation-speed': animationSpeed,
		'data-paused': isPaused ? 'true' : 'false',
		'data-respect-motion': respectMotionPreference ? 'true' : 'false',
		'data-blend-mode': blendMode
	});

	return (
		<div {...blockProps}>
			<div className="agc-inner-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}