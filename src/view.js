
/**
 * Frontend JavaScript for Animated Gradient Container Block
 *
 * Handles motion preference detection and accessibility features
 */

document.addEventListener('DOMContentLoaded', function() {
	// Get all animated gradient containers
	const containers = document.querySelectorAll('.wp-block-telex-block-animated-gradient-container');
	
	if (!containers.length) {
		return;
	}
	
	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	// Handle motion preference changes
	function handleMotionPreference() {
		containers.forEach(container => {
			const respectsMotion = container.dataset.respectMotion === 'true';
			
			if (respectsMotion && prefersReducedMotion) {
				container.style.animation = 'none';
				container.classList.add('agc-motion-disabled');
			}
		});
	}
	
	// Initial setup
	handleMotionPreference();
	
	// Listen for motion preference changes
	const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
	if (mediaQuery.addEventListener) {
		mediaQuery.addEventListener('change', handleMotionPreference);
	} else {
		// Fallback for older browsers
		mediaQuery.addListener(handleMotionPreference);
	}
	
	// Performance optimization: Pause animations when not visible
	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				const container = entry.target;
				const isPaused = container.dataset.paused === 'true';
				
				if (!isPaused && !prefersReducedMotion) {
					if (entry.isIntersecting) {
						// Resume animation when visible
						container.style.animationPlayState = 'running';
					} else {
						// Pause animation when not visible for performance
						container.style.animationPlayState = 'paused';
					}
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '50px'
		});
		
		containers.forEach(container => {
			observer.observe(container);
		});
	}
	
	// Add keyboard navigation support for accessibility
	containers.forEach(container => {
		// Make focusable if it contains interactive content
		if (container.querySelector('a, button, input, textarea, select')) {
			container.setAttribute('tabindex', '0');
			
			// Add focus styles
			container.addEventListener('focus', function() {
				this.style.outline = '2px solid #007cba';
				this.style.outlineOffset = '2px';
			});
			
			container.addEventListener('blur', function() {
				this.style.outline = '';
				this.style.outlineOffset = '';
			});
		}
	});
	
	// Log initialization for debugging
	if (window.console && window.console.log) {
		console.log('Animated Gradient Container: Initialized ' + containers.length + ' containers');
		if (prefersReducedMotion) {
			console.log('Animated Gradient Container: Reduced motion preference detected');
		}
	}
});

// Utility function to update animation based on attributes
function updateGradientAnimation(container, attributes) {
	if (!container || !attributes) {
		return;
	}
	
	const {
		animationType = 'horizontal',
		animationSpeed = 'medium',
		isPaused = false,
		respectMotionPreference = true
	} = attributes;
	
	const speedMap = {
		slow: '8s',
		medium: '4s',
		fast: '2s'
	};
	
	const duration = speedMap[animationSpeed] || speedMap.medium;
	const animationName = `agc-${animationType}`;
	const timingFunction = animationType === 'rotation' ? 'linear' : 'ease-in-out';
	
	let animation = `${animationName} ${duration} ${timingFunction} infinite`;
	
	if (isPaused) {
		animation += ' paused';
	}
	
	// Check motion preferences
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	
	if (respectMotionPreference && prefersReducedMotion) {
		container.style.animation = 'none';
		container.classList.add('agc-motion-disabled');
	} else {
		container.style.animation = animation;
		container.classList.remove('agc-motion-disabled');
	}
}

// Export for potential external use
if (typeof window !== 'undefined') {
	window.AnimatedGradientContainer = {
		updateAnimation: updateGradientAnimation
	};
}
