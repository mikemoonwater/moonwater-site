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
                    // First, collapse all other principles
                    toggleButtons.forEach(otherButton => {
                        if (otherButton !== button) {
                            const otherArticle = otherButton.closest('.principle');
                            const otherContent = otherArticle.querySelector('.principle-content');
                            otherButton.setAttribute('aria-expanded', 'false');
                            otherContent.hidden = true;
                            otherArticle.classList.remove('expanded');
                        }
                    });
                    
                    // Then expand this one
                    button.setAttribute('aria-expanded', 'true');
                    content.hidden = false;
                    article.classList.add('expanded');
                }
            });
        });
    }

    // =========================================================================
    // PRINCIPLES - Scroll-based Fade
    // =========================================================================
    
    function initScrollFade() {
        const principles = document.querySelectorAll('.principle');
        if (!principles.length) return;
        
        function updateFade() {
            const viewportBottom = window.scrollY + window.innerHeight;
            const fadeOffset = 200; // Start fading items 200px below viewport
            
            principles.forEach(principle => {
                const rect = principle.getBoundingClientRect();
                const elementTop = rect.top + window.scrollY;
                
                // If element is below the viewport (plus offset), fade it
                if (elementTop > viewportBottom + fadeOffset) {
                    principle.classList.add('fade-in');
                } else {
                    principle.classList.remove('fade-in');
                }
            });
        }
        
        // Update on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateFade();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Initial update
        updateFade();
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

    // =========================================================================
    // CONTACT MODAL
    // =========================================================================
    
    function initContactModal() {
        const modal = document.getElementById('contact-modal');
        const openBtn = document.getElementById('open-contact');
        const closeBtn = document.getElementById('close-contact');
        const form = document.getElementById('contact-form');
        
        if (!modal || !openBtn) return;
        
        let previousActiveElement = null;
        
        function openModal() {
            previousActiveElement = document.activeElement;
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
            
            // Focus first input after short delay for animation
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
        
        function closeModal() {
            modal.hidden = true;
            document.body.style.overflow = '';
            
            // Return focus to trigger button
            if (previousActiveElement) {
                previousActiveElement.focus();
            }
        }
        
        // Open modal
        openBtn.addEventListener('click', openModal);
        
        // Close modal - X button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        
        // Close modal - click overlay background
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal - Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.hidden) {
                closeModal();
            }
        });
        
        // Focus trap within modal
        modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
        
        // Handle form submission
        if (form) {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('.form-submit');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }
            });
        }
    }

    /**
     * Initialize everything
     */
    function init() {
        // Initialize principles expand/collapse
        initPrinciples();
        
        // Initialize scroll-based fade for principles
        if (!prefersReducedMotion()) {
            initScrollFade();
        }
        
        // Initialize contact modal
        initContactModal();
        
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
