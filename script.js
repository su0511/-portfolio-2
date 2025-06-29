/**
 * SUSAN HE Portfolio 2024 - Swiss Design
 * Minimal, purposeful interactions for a timeless design
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===================================
    // CUSTOM CURSOR
    // ===================================

    const cursor = document.querySelector('.cursor');

    if (cursor && !window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
        // Cursor follows mouse movement
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hover effects on interactive elements
        const interactiveElements = document.querySelectorAll(
            'a, button, .project-carousel, .carousel-arrow, .lightbox-close, [role="button"]'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
            });

            element.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
            });
        });

        // Hide cursor when leaving page
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    }

    // ===================================
    // LOADING SCREEN
    // ===================================

    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    if (loader) {
        // Hide loader after 2.4 seconds
        setTimeout(() => {
            loader.classList.add('hidden');

            // Remove loader from DOM after animation
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                // Enable scrolling
                document.body.style.overflow = 'auto';
            }, 800);
        }, 2400);

        // Disable scrolling during loading
        document.body.style.overflow = 'hidden';
    }

    // ===================================
    // HERO PAGE INTERACTIONS
    // ===================================

    const heroLogo = document.getElementById('hero-logo');

    if (heroLogo) {
        // Click handler for hero logo
        function navigateToWork() {
            window.location.href = 'work.html';
        }

        heroLogo.addEventListener('click', navigateToWork);

        // Scroll handler for hero page
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.scrollY > 50) {
                    navigateToWork();
                }
            }, 100);
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                navigateToWork();
            }
        });
    }

    // ===================================
    // CAROUSEL FUNCTIONALITY
    // ===================================

    class Carousel {
        constructor(container) {
            this.container = container;
            this.track = container.querySelector('.carousel-track');
            this.slides = container.querySelectorAll('.carousel-slide');
            this.prevBtn = container.querySelector('.carousel-prev');
            this.nextBtn = container.querySelector('.carousel-next');
            this.currentIndex = 0;

            this.init();
        }

        init() {
            if (this.slides.length <= 1) {
                // Hide arrows if only one slide
                if (this.prevBtn) this.prevBtn.style.display = 'none';
                if (this.nextBtn) this.nextBtn.style.display = 'none';
                return;
            }

            // Event listeners
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }

            // Keyboard navigation
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                }
            });

            // Touch/swipe support for mobile
            this.addTouchSupport();

            // Click to open lightbox
            this.container.addEventListener('click', (e) => {
                if (!e.target.closest('.carousel-arrow')) {
                    this.openLightbox();
                }
            });
        }

        prev() {
            this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.slides.length - 1;
            this.updateSlides();
        }

        next() {
            this.currentIndex = this.currentIndex < this.slides.length - 1 ? this.currentIndex + 1 : 0;
            this.updateSlides();
        }

        updateSlides() {
            this.slides.forEach((slide, index) => {
                slide.classList.remove('active', 'prev');

                if (index === this.currentIndex) {
                    slide.classList.add('active');
                } else if (index < this.currentIndex) {
                    slide.classList.add('prev');
                }
            });
        }

        addTouchSupport() {
            let startX = 0;
            let startY = 0;
            let endX = 0;
            let endY = 0;

            this.container.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            });

            this.container.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;

                const deltaX = endX - startX;
                const deltaY = endY - startY;

                // Only trigger if horizontal swipe is more significant than vertical
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        this.prev();
                    } else {
                        this.next();
                    }
                }
            });
        }

        openLightbox() {
            const currentSlide = this.slides[this.currentIndex];
            const img = currentSlide.querySelector('img');
            if (img && window.lightbox) {
                window.lightbox.open(img.src, img.alt, this.getAllImages(), this.currentIndex);
            }
        }

        getAllImages() {
            return Array.from(this.slides).map(slide => {
                const img = slide.querySelector('img');
                return {
                    src: img.src,
                    alt: img.alt
                };
            });
        }
    }

    // ===================================
    // LIGHTBOX FUNCTIONALITY
    // ===================================

    class Lightbox {
        constructor() {
            this.lightbox = document.getElementById('lightbox');
            this.lightboxImage = this.lightbox?.querySelector('.lightbox-image');
            this.closeBtn = this.lightbox?.querySelector('.lightbox-close');
            this.prevBtn = this.lightbox?.querySelector('.lightbox-prev');
            this.nextBtn = this.lightbox?.querySelector('.lightbox-next');

            this.images = [];
            this.currentIndex = 0;

            this.init();
        }

        init() {
            if (!this.lightbox) return;

            // Close button
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }

            // Navigation buttons
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prev());
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.next());
            }

            // Close on background click
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) {
                    this.close();
                }
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!this.lightbox.open) return;

                switch(e.key) {
                    case 'Escape':
                        this.close();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.next();
                        break;
                }
            });
        }

        open(src, alt, images = [], index = 0) {
            this.images = images.length > 0 ? images : [{src, alt}];
            this.currentIndex = index;

            this.updateImage();
            this.updateNavigation();

            if (this.lightbox.showModal) {
                this.lightbox.showModal();
            } else {
                this.lightbox.open = true;
            }

            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        close() {
            if (this.lightbox.close) {
                this.lightbox.close();
            } else {
                this.lightbox.open = false;
            }

            // Restore body scroll
            document.body.style.overflow = 'auto';
        }

        prev() {
            this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
            this.updateImage();
        }

        next() {
            this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
            this.updateImage();
        }

        updateImage() {
            if (this.lightboxImage && this.images[this.currentIndex]) {
                const currentImage = this.images[this.currentIndex];
                this.lightboxImage.src = currentImage.src;
                this.lightboxImage.alt = currentImage.alt;
            }
        }

        updateNavigation() {
            if (this.images.length <= 1) {
                if (this.prevBtn) this.prevBtn.style.display = 'none';
                if (this.nextBtn) this.nextBtn.style.display = 'none';
            } else {
                if (this.prevBtn) this.prevBtn.style.display = 'block';
                if (this.nextBtn) this.nextBtn.style.display = 'block';
            }
        }
    }

    // ===================================
    // IMAGE LAZY LOADING
    // ===================================

    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Add fade-in animation
                        img.addEventListener('load', () => {
                            if (!prefersReducedMotion) {
                                img.style.opacity = '0';
                                img.style.transition = 'opacity 0.3s ease';
                                requestAnimationFrame(() => {
                                    img.style.opacity = '1';
                                });
                            }
                            img.classList.add('loaded');
                        });

                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.classList.add('loaded');
            });
        }
    }

    // ===================================
    // SCROLL SNAP FUNCTIONALITY
    // ===================================

    function initScrollSnap() {
        if (prefersReducedMotion) return;

        const projects = document.querySelectorAll('.project');
        if (projects.length === 0) return;

        // Add scroll snap to work container
        const workContainer = document.querySelector('.work-container');
        if (workContainer) {
            workContainer.style.scrollSnapType = 'y mandatory';
            projects.forEach(project => {
                project.style.scrollSnapAlign = 'start';
            });
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================

    // Initialize lightbox
    window.lightbox = new Lightbox();

    // Initialize carousels
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        new Carousel(container);
    });

    // Initialize lazy loading
    initLazyLoading();

    // Initialize scroll snap
    initScrollSnap();

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

});