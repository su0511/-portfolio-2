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
            'a, button, .project-carousel, .carousel-arrow, .lightbox-close, .lb-arrow, [role="button"]'
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
    const exploreIndicator = document.getElementById('explore-indicator');

    if (heroLogo || exploreIndicator) {
        // Navigation function with Swup support
        function navigateToWork() {
            if (typeof Swup !== 'undefined' && window.swup) {
                window.swup.loadPage({
                    url: 'work.html'
                });
            } else {
                window.location.href = 'work.html';
            }
        }

        // Click handlers
        if (heroLogo) {
            heroLogo.addEventListener('click', navigateToWork);
        }

        if (exploreIndicator) {
            exploreIndicator.addEventListener('click', navigateToWork);
        }

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
    // CAROUSEL FUNCTIONALITY (New Structure)
    // ===================================

    function initCarousels() {
        // Initialize all carousels
        document.querySelectorAll('.carousel').forEach(carousel => {
        const slides = carousel.querySelectorAll('.slide');
        let idx = 0;

        const update = () => slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));

        // Navigation buttons
        const nextBtn = carousel.querySelector('.next');
        const prevBtn = carousel.querySelector('.prev');

        if (nextBtn) {
            nextBtn.onclick = () => {
                idx = (idx + 1) % slides.length;
                update();
            };
        }

        if (prevBtn) {
            prevBtn.onclick = () => {
                idx = (idx - 1 + slides.length) % slides.length;
                update();
            };
        }

        // Hide arrows if only one slide
        if (slides.length <= 1) {
            if (nextBtn) nextBtn.style.display = 'none';
            if (prevBtn) prevBtn.style.display = 'none';
        }

        // Touch/swipe support
        let startX = 0;
        let startY = 0;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    if (prevBtn) prevBtn.click();
                } else {
                    if (nextBtn) nextBtn.click();
                }
            }
        });

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && prevBtn) {
                e.preventDefault();
                prevBtn.click();
            } else if (e.key === 'ArrowRight' && nextBtn) {
                e.preventDefault();
                nextBtn.click();
            }
        });

        // Lightbox functionality - bind once to carousel, not individual slides
        carousel.addEventListener('click', (e) => {
            const slide = e.target.closest('.slide');
            if (slide && !e.target.closest('.arrow')) {
                const slideIndex = [...slides].indexOf(slide);
                openLightbox(slideIndex, slides);
            }
        });
        });
    }

    // Initialize carousels on page load
    initCarousels();

    // ===================================
    // LIGHTBOX FUNCTIONALITY (Updated)
    // ===================================

    function openLightbox(startIdx, slides) {
        console.log('Opening lightbox for slide:', startIdx);
        let currentIdx = startIdx;

        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';

        // Function to update media content
        const updateMedia = (idx) => {
            // Clear existing media (including GIFs)
            const existingMedia = lightbox.querySelector('img, video');
            if (existingMedia) {
                existingMedia.remove();
            }

            // Get the current slide's media
            const currentSlide = slides[idx];
            const img = currentSlide.querySelector('img');
            const video = currentSlide.querySelector('video');

            let mediaElement;
            if (img) {
                mediaElement = document.createElement('img');
                mediaElement.src = img.src;
                mediaElement.alt = img.alt || '';

                // Add some inline styles to ensure visibility
                mediaElement.style.cssText = `
                    max-width: 90vw !important;
                    max-height: 90vh !important;
                    object-fit: contain !important;
                    display: block !important;
                    margin: auto !important;
                    opacity: 1 !important;
                    position: relative !important;
                    z-index: 10001 !important;
                `;
            } else if (video) {
                mediaElement = document.createElement('video');
                mediaElement.src = video.src;
                mediaElement.controls = true;
                mediaElement.autoplay = true;
                mediaElement.loop = true;
                mediaElement.muted = true;

                // Add some inline styles to ensure visibility
                mediaElement.style.maxWidth = '90vw';
                mediaElement.style.maxHeight = '90vh';
                mediaElement.style.objectFit = 'contain';
                mediaElement.style.display = 'block';
            }

            if (mediaElement) {
                // Insert media before navigation arrows
                const firstArrow = lightbox.querySelector('.lb-arrow');
                if (firstArrow) {
                    lightbox.insertBefore(mediaElement, firstArrow);
                } else {
                    lightbox.appendChild(mediaElement);
                }
            }
        };

        // Create navigation arrows (only if more than one slide)
        if (slides.length > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'lb-arrow lb-prev';
            prevBtn.innerHTML = '‹';
            prevBtn.addEventListener('click', () => {
                currentIdx = (currentIdx - 1 + slides.length) % slides.length;
                updateMedia(currentIdx);
            });
            lightbox.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'lb-arrow lb-next';
            nextBtn.innerHTML = '›';
            nextBtn.addEventListener('click', () => {
                currentIdx = (currentIdx + 1) % slides.length;
                updateMedia(currentIdx);
            });
            lightbox.appendChild(nextBtn);
        }

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'lb-close';
        closeBtn.innerHTML = '×';
        lightbox.appendChild(closeBtn);

        // Initialize with first media
        updateMedia(currentIdx);

        // Add to page
        document.body.appendChild(lightbox);

        // Close functionality
        const closeLightbox = () => {
            document.body.removeChild(lightbox);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'ArrowLeft' && slides.length > 1) {
                currentIdx = (currentIdx - 1 + slides.length) % slides.length;
                updateMedia(currentIdx);
            } else if (e.key === 'ArrowRight' && slides.length > 1) {
                currentIdx = (currentIdx + 1) % slides.length;
                updateMedia(currentIdx);
            }
        };

        document.addEventListener('keydown', handleKeydown);

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
    // SWUP PAGE TRANSITIONS
    // ===================================

    if (typeof Swup !== 'undefined') {
        try {
            window.swup = new Swup({
                containers: ['#swup'],
                animateHistoryBrowsing: true
            });

            // Check if swup.on method exists before using it
            if (window.swup && typeof window.swup.on === 'function') {
                // Re-initialize functionality after page transitions
                window.swup.on('contentReplaced', function() {
                    // Re-initialize carousels
                    initCarousels();

                    // Re-initialize lazy loading
                    initLazyLoading();
                });
            } else {
                console.log('Swup.on method not available');
            }
        } catch (error) {
            console.log('Swup initialization failed:', error);
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================

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
