/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { 
	useBlockProps, 
	InspectorControls, 
	InnerBlocks,
	useInnerBlocksProps
} from '@wordpress/block-editor';

/**
 * WordPress components
 */
import { 
	PanelBody, 
	SelectControl, 
	ToggleControl, 
	RangeControl 
} from '@wordpress/components';

/**
 * WordPress data
 */
import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * Gradient schemes configuration
 */
const GRADIENT_SCHEMES = {
	sunset: {
		colors: ['#ff9a56', '#ff6b95', '#c44569', '#f8b500'],
		label: __('Sunset', 'animated-gradient-container-block-wp')
	},
	ocean: {
		colors: ['#005c98', '#339dcc', '#62d2a2', '#1dd3b0'],
		label: __('Ocean', 'animated-gradient-container-block-wp')
	},
	forest: {
		colors: ['#2d5016', '#61892f', '#86c232', '#6b6e70'],
		label: __('Forest', 'animated-gradient-container-block-wp')
	},
	cosmic: {
		colors: ['#1a1a2e', '#16213e', '#0f4c75', '#3282b8'],
		label: __('Cosmic', 'animated-gradient-container-block-wp')
	},
	rainbow: {
		colors: ['#ff0844', '#ffb199', '#ffd23f', '#3bceac', '#0ead69'],
		label: __('Rainbow', 'animated-gradient-container-block-wp')
	}
};

/**
 * Animation types configuration
 */
const ANIMATION_TYPES = {
	horizontal: __('Horizontal Slide', 'animated-gradient-container-block-wp'),
	radial: __('Radial Pulse', 'animated-gradient-container-block-wp'),
	diagonal: __('Diagonal Sweep', 'animated-gradient-container-block-wp'),
	rotation: __('Rotation', 'animated-gradient-container-block-wp')
};

/**
 * Speed settings
 */
const SPEED_SETTINGS = {
	slow: { label: __('Slow', 'animated-gradient-container-block-wp'), duration: '8s' },
	medium: { label: __('Medium', 'animated-gradient-container-block-wp'), duration: '4s' },
	fast: { label: __('Fast', 'animated-gradient-container-block-wp'), duration: '2s' }
};

/**
 * Blend modes
 */
const BLEND_MODES = [
	{ value: 'normal', label: __('Normal', 'animated-gradient-container-block-wp') },
	{ value: 'multiply', label: __('Multiply', 'animated-gradient-container-block-wp') },
	{ value: 'screen', label: __('Screen', 'animated-gradient-container-block-wp') },
	{ value: 'overlay', label: __('Overlay', 'animated-gradient-container-block-wp') },
	{ value: 'soft-light', label: __('Soft Light', 'animated-gradient-container-block-wp') },
	{ value: 'hard-light', label: __('Hard Light', 'animated-gradient-container-block-wp') },
	{ value: 'color-dodge', label: __('Color Dodge', 'animated-gradient-container-block-wp') },
	{ value: 'color-burn', label: __('Color Burn', 'animated-gradient-container-block-wp') }
];

/**
 * Generate gradient CSS based on scheme and animation
 */
function generateGradientCSS(scheme, animationType, speed, isPaused, blendMode) {
	const colors = GRADIENT_SCHEMES[scheme]?.colors || GRADIENT_SCHEMES.sunset.colors;
	const duration = SPEED_SETTINGS[speed]?.duration || SPEED_SETTINGS.medium.duration;
	
	let background = '';
	let animation = '';
	
	switch (animationType) {
		case 'horizontal':
			background = `linear-gradient(-45deg, ${colors.join(', ')})`;
			animation = `agc-horizontal ${duration} ease-in-out infinite`;
			break;
		case 'radial':
			background = `radial-gradient(circle, ${colors.join(', ')})`;
			animation = `agc-radial ${duration} ease-in-out infinite`;
			break;
		case 'diagonal':
			background = `linear-gradient(45deg, ${colors.join(', ')})`;
			animation = `agc-diagonal ${duration} ease-in-out infinite`;
			break;
		case 'rotation':
			background = `conic-gradient(${colors.join(', ')})`;
			animation = `agc-rotation ${duration} linear infinite`;
			break;
		default:
			background = `linear-gradient(-45deg, ${colors.join(', ')})`;
			animation = `agc-horizontal ${duration} ease-in-out infinite`;
	}
	
	if (isPaused) {
		animation += ' paused';
	}
	
	return {
		background,
		backgroundSize: animationType === 'horizontal' || animationType === 'diagonal' ? '400% 400%' : 'auto',
		animation,
		mixBlendMode: blendMode !== 'normal' ? blendMode : undefined
	};
}

/**
 * Template for inner blocks
 */
const TEMPLATE = [
	[
		'core/heading',
		{
			content: __('Add your content here', 'animated-gradient-container-block-wp'),
			level: 2,
			textAlign: 'center',
			style: {
				color: {
					text: '#ffffff'
				},
				typography: {
					textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
				}
			}
		}
	]
];

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		gradientScheme,
		animationType,
		animationSpeed,
		isPaused,
		minHeight,
		blendMode,
		respectMotionPreference
	} = attributes;

	// Use a safe selector that doesn't rely on experimental features
	const hasInnerBlocks = useSelect((select) => {
		try {
			const { getBlockCount } = select('core/block-editor');
			return getBlockCount && typeof getBlockCount === 'function';
		} catch (error) {
			// Fallback if selector is not available
			return false;
		}
	}, []);

	const blockProps = useBlockProps({
		style: {
			...generateGradientCSS(gradientScheme, animationType, animationSpeed, isPaused, blendMode),
			minHeight: `${minHeight}px`,
			position: 'relative',
			overflow: 'hidden'
		}
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'agc-inner-content'
		},
		{
			template: TEMPLATE,
			templateInsertUpdatesSelection: false
		}
	);

	const gradientOptions = Object.keys(GRADIENT_SCHEMES).map(key => ({
		value: key,
		label: GRADIENT_SCHEMES[key].label
	}));

	const animationOptions = Object.keys(ANIMATION_TYPES).map(key => ({
		value: key,
		label: ANIMATION_TYPES[key]
	}));

	const speedOptions = Object.keys(SPEED_SETTINGS).map(key => ({
		value: key,
		label: SPEED_SETTINGS[key].label
	}));

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Gradient Settings', 'animated-gradient-container-block-wp')} initialOpen={true}>
					<SelectControl
						label={__('Gradient Scheme', 'animated-gradient-container-block-wp')}
						value={gradientScheme}
						options={gradientOptions}
						onChange={(value) => setAttributes({ gradientScheme: value })}
						help={__('Choose from predefined color schemes', 'animated-gradient-container-block-wp')}
					/>
					
					<SelectControl
						label={__('Animation Type', 'animated-gradient-container-block-wp')}
						value={animationType}
						options={animationOptions}
						onChange={(value) => setAttributes({ animationType: value })}
						help={__('Select the animation pattern', 'animated-gradient-container-block-wp')}
					/>
					
					<SelectControl
						label={__('Animation Speed', 'animated-gradient-container-block-wp')}
						value={animationSpeed}
						options={speedOptions}
						onChange={(value) => setAttributes({ animationSpeed: value })}
						help={__('Control animation timing', 'animated-gradient-container-block-wp')}
					/>
					
					<ToggleControl
						label={__('Pause Animation', 'animated-gradient-container-block-wp')}
						checked={isPaused}
						onChange={(value) => setAttributes({ isPaused: value })}
						help={__('Temporarily pause the animation', 'animated-gradient-container-block-wp')}
					/>
				</PanelBody>
				
				<PanelBody title={__('Layout Settings', 'animated-gradient-container-block-wp')} initialOpen={false}>
					<RangeControl
						label={__('Minimum Height (px)', 'animated-gradient-container-block-wp')}
						value={minHeight}
						onChange={(value) => setAttributes({ minHeight: value })}
						min={200}
						max={800}
						step={10}
						help={__('Set the minimum height of the container', 'animated-gradient-container-block-wp')}
					/>
					
					<SelectControl
						label={__('Background Blend Mode', 'animated-gradient-container-block-wp')}
						value={blendMode}
						options={BLEND_MODES}
						onChange={(value) => setAttributes({ blendMode: value })}
						help={__('Choose how the gradient blends with content behind it', 'animated-gradient-container-block-wp')}
					/>
				</PanelBody>
				
				<PanelBody title={__('Accessibility', 'animated-gradient-container-block-wp')} initialOpen={false}>
					<ToggleControl
						label={__('Respect Motion Preferences', 'animated-gradient-container-block-wp')}
						checked={respectMotionPreference}
						onChange={(value) => setAttributes({ respectMotionPreference: value })}
						help={__('Automatically disable animations for users who prefer reduced motion', 'animated-gradient-container-block-wp')}
					/>
				</PanelBody>
			</InspectorControls>
			
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		</>
	);
}