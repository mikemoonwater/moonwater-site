/**
 * Moonwater - JavaScript
 * Principles expand/collapse + Testimonials carousel
 */

(function() {
    'use strict';

    // =========================================================================
    // PRINCIPLES - Expand/Collapse
    // =========================================================================
    
    function initPrinciples() {
        const toggleButtons = document.querySelectorAll('.principle-toggle');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const article = button.closest('.principle');
                const content = article.querySelector('.principle-content');
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                
                if (isExpanded) {
                    // Collapse
                    button.setAttribute('aria-expanded', 'false');
                    content.hidden = true;
                    article.classList.remove('expanded');
                } else {
                    // Expand
                    button.setAttribute('aria-expanded', 'true');
                    content.hidden = false;
                    article.classList.add('expanded');
                }
            });
        });
    }

    // =========================================================================
    // TESTIMONIALS - Carousel
    // =========================================================================

    // Configuration
    const AUTOPLAY_INTERVAL = 6000; // 6 seconds
    const TOTAL_TESTIMONIALS = 11;

    // State
    let currentIndex = 0;
    let autoplayTimer = null;
    let isPaused = false;

    // DOM Elements
    const track = document.getElementById('testimonials-track');
    const dots = document.querySelectorAll('.nav-dot');

    /**
     * Go to a specific testimonial
     * @param {number} index - The index to navigate to
     */
    function goToTestimonial(index) {
        // Wrap around
        if (index < 0) {
            index = TOTAL_TESTIMONIALS - 1;
        } else if (index >= TOTAL_TESTIMONIALS) {
            index = 0;
        }

        currentIndex = index;

        // Move the track
        const offset = -100 * currentIndex;
        track.style.transform = `translateX(${offset}%)`;

        // Update dots
        dots.forEach((dot, i) => {
            const isActive = i === currentIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive.toString());
        });
    }

    /**
     * Go to the next testimonial
     */
    function nextTestimonial() {
        goToTestimonial(currentIndex + 1);
    }

    /**
     * Start autoplay
     */
    function startAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
        }
        autoplayTimer = setInterval(() => {
            if (!isPaused) {
                nextTestimonial();
            }
        }, AUTOPLAY_INTERVAL);
    }

    /**
     * Stop autoplay
     */
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    /**
     * Reset autoplay timer (called after manual navigation)
     */
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    /**
     * Initialize dot click handlers
     */
    function initDots() {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToTestimonial(index);
                resetAutoplay();
            });

            // Keyboard support
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % TOTAL_TESTIMONIALS;
                    dots[nextIndex].focus();
                    goToTestimonial(nextIndex);
                    resetAutoplay();
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + TOTAL_TESTIMONIALS) % TOTAL_TESTIMONIALS;
                    dots[prevIndex].focus();
                    goToTestimonial(prevIndex);
                    resetAutoplay();
                }
            });
        });
    }

    /**
     * Pause autoplay when user hovers over testimonials
     */
    function initHoverPause() {
        const container = document.querySelector('.testimonials');
        if (container) {
            container.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            container.addEventListener('mouseleave', () => {
                isPaused = false;
            });
        }
    }

    /**
     * Handle visibility change (pause when tab is hidden)
     */
    function initVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isPaused = true;
            } else {
                isPaused = false;
            }
        });
    }

    /**
     * Initialize touch/swipe support
     */
    function initSwipe() {
        const container = document.querySelector('.testimonials-container');
        if (!container) return;

        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const distance = touchEndX - touchStartX;
            if (Math.abs(distance) > minSwipeDistance) {
                if (distance > 0) {
                    // Swipe right - go to previous
                    goToTestimonial(currentIndex - 1);
                } else {
                    // Swipe left - go to next
                    goToTestimonial(currentIndex + 1);
                }
                resetAutoplay();
            }
        }
    }

    /**
     * Check for reduced motion preference
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Initialize everything
     */
    function init() {
        // Initialize principles expand/collapse
        initPrinciples();
        
        // Initialize testimonials carousel (if elements exist)
        if (track && dots.length > 0) {
            initDots();
            initHoverPause();
            initVisibilityHandler();
            initSwipe();

            // Start autoplay unless user prefers reduced motion
            if (!prefersReducedMotion()) {
                startAutoplay();
            }

            // Set initial state
            goToTestimonial(0);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
