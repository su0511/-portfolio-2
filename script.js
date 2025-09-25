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
        // Hide loader after 1.8 seconds
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
        }, 1800);

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
    // CAROUSEL FUNCTIONALITY (Enhanced)
    // ===================================

    function initCarousels() {
        // Initialize all carousels
        document.querySelectorAll('.carousel').forEach(carousel => {
        const slides = carousel.querySelectorAll('.slide');
        let idx = 0;
        let isTransitioning = false;

        // Create indicators dynamically
        createCarouselIndicators(carousel, slides.length);

        const update = () => {
            if (isTransitioning) return;
            isTransitioning = true;

            // Update slides
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === idx);
            });

            // Update indicators
            updateCarouselIndicators(carousel, idx, slides.length);

            // Reset transition lock after animation completes
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        };

        // Initialize first slide
        update();

        // Navigation buttons
        const nextBtn = carousel.querySelector('.next');
        const prevBtn = carousel.querySelector('.prev');

        if (nextBtn) {
            nextBtn.onclick = () => {
                if (isTransitioning) return;
                idx = (idx + 1) % slides.length;
                update();
            };
        }

        if (prevBtn) {
            prevBtn.onclick = () => {
                if (isTransitioning) return;
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

        // Enhanced keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && prevBtn && !isTransitioning) {
                e.preventDefault();
                prevBtn.click();
                announceSlideChange(idx + 1, slides.length);
            } else if (e.key === 'ArrowRight' && nextBtn && !isTransitioning) {
                e.preventDefault();
                nextBtn.click();
                announceSlideChange(idx + 1, slides.length);
            } else if (e.key === 'Home' && !isTransitioning) {
                e.preventDefault();
                idx = 0;
                update();
                announceSlideChange(1, slides.length);
            } else if (e.key === 'End' && !isTransitioning) {
                e.preventDefault();
                idx = slides.length - 1;
                update();
                announceSlideChange(slides.length, slides.length);
            }
        });

        // Make carousel focusable
        carousel.setAttribute('tabindex', '0');
        carousel.setAttribute('role', 'region');
        carousel.setAttribute('aria-label', `Image carousel with ${slides.length} slides`);

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

    // ===================================
    // CAROUSEL HELPER FUNCTIONS
    // ===================================
    
    function createCarouselIndicators(carousel, slideCount) {
        // Remove existing indicators if any
        const existingIndicators = carousel.querySelector('.carousel-indicators');
        if (existingIndicators) {
            existingIndicators.remove();
        }

        // Always create counter for consistency
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        // Ensure high z-index to prevent coverage by other elements
        indicators.style.zIndex = '99999';
        
        const counter = document.createElement('span');
        counter.className = 'slide-counter';
        counter.textContent = `1 / ${slideCount}`;
        
        indicators.appendChild(counter);
        carousel.appendChild(indicators);
    }

    function updateCarouselIndicators(carousel, currentIndex, totalSlides) {
        const counter = carousel.querySelector('.slide-counter');
        
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
        }
    }

    // ===================================
    // PROJECT NAVIGATION & PROGRESS
    // ===================================
    
    function initProjectNavigation() {
        const projects = document.querySelectorAll('.project');
        const navItems = document.querySelectorAll('.project-nav-item');
        const progressBar = document.querySelector('.progress-bar');
        
        // Smooth scroll to project
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href');
                const targetProject = document.querySelector(targetId);
                
                if (targetProject) {
                    // Center the project title vertically in the viewport
                    const elementTop = targetProject.getBoundingClientRect().top + window.pageYOffset;
                    const viewportHeight = window.innerHeight;
                    const offsetTop = elementTop - (viewportHeight / 2) + (targetProject.offsetHeight / 2);
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });

        // Update active nav item and progress on scroll
        function updateNavigation() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;
            
            // Update progress bar
            if (progressBar) {
                progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            }
            
            // Update active nav item
            let activeProject = null;
            projects.forEach((project, index) => {
                const rect = project.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    activeProject = index;
                }
            });
            
            navItems.forEach((item, index) => {
                item.classList.toggle('active', index === activeProject);
            });
        }
        
        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateNavigation, 10);
        });
        
        // Initial update
        updateNavigation();
    }

    // Initialize carousels on page load
    initCarousels();
    
    // Initialize project navigation
    initProjectNavigation();

    // ===================================
    // ACCESSIBILITY HELPERS
    // ===================================
    
    function announceSlideChange(current, total) {
        const announcement = `Slide ${current} of ${total}`;
        
        // Create or update live region
        let liveRegion = document.getElementById('slide-announcer');
        if (!liveRegion) {
            liveRegion = document.createElement('div');
            liveRegion.id = 'slide-announcer';
            liveRegion.className = 'sr-only';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
        
        liveRegion.textContent = announcement;
    }

    function initKeyboardNavigation() {
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in an input
            if (e.target.matches('input, textarea, [contenteditable]')) return;
            
            switch(e.key) {
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    e.preventDefault();
                    const projectNum = parseInt(e.key);
                    const projectTitle = document.getElementById(`project-${projectNum}-title`);
                    if (projectTitle) {
                        // Center the project title vertically in the viewport
                        const elementTop = projectTitle.getBoundingClientRect().top + window.pageYOffset;
                        const viewportHeight = window.innerHeight;
                        const offsetTop = elementTop - (viewportHeight / 2) + (projectTitle.offsetHeight / 2);
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: prefersReducedMotion ? 'auto' : 'smooth'
                        });
                        projectTitle.focus();
                    }
                    break;
                case 'h':
                case 'H':
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                    break;
            }
        });
    }

    // Initialize keyboard navigation
    initKeyboardNavigation();

    // ===================================
    // LIGHTBOX FUNCTIONALITY (Updated)
    // ===================================

    function openLightbox(startIdx, slides) {
        console.log('Opening lightbox for slide:', startIdx);
        let currentIdx = startIdx;
        let lightboxTransitioning = false;

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
                if (!lightboxTransitioning) {
                    lightboxTransitioning = true;
                    currentIdx = (currentIdx - 1 + slides.length) % slides.length;
                    updateMedia(currentIdx);
                    setTimeout(() => { lightboxTransitioning = false; }, 300);
                }
            });
            lightbox.appendChild(prevBtn);

            const nextBtn = document.createElement('button');
            nextBtn.className = 'lb-arrow lb-next';
            nextBtn.innerHTML = '›';
            nextBtn.addEventListener('click', () => {
                if (!lightboxTransitioning) {
                    lightboxTransitioning = true;
                    currentIdx = (currentIdx + 1) % slides.length;
                    updateMedia(currentIdx);
                    setTimeout(() => { lightboxTransitioning = false; }, 300);
                }
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

        // Keyboard navigation with smooth transition
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'ArrowLeft' && slides.length > 1 && !lightboxTransitioning) {
                lightboxTransitioning = true;
                currentIdx = (currentIdx - 1 + slides.length) % slides.length;
                updateMedia(currentIdx);
                setTimeout(() => { lightboxTransitioning = false; }, 300);
            } else if (e.key === 'ArrowRight' && slides.length > 1 && !lightboxTransitioning) {
                lightboxTransitioning = true;
                currentIdx = (currentIdx + 1) % slides.length;
                updateMedia(currentIdx);
                setTimeout(() => { lightboxTransitioning = false; }, 300);
            }
        };

        document.addEventListener('keydown', handleKeydown);

    }



    // ===================================
    // IMAGE LAZY LOADING & PRELOADING
    // ===================================

    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Show loading indicator
                        showImageLoader(img);

                        // Add fade-in animation
                        img.addEventListener('load', () => {
                            hideImageLoader(img);
                            if (!prefersReducedMotion) {
                                img.style.opacity = '0';
                                img.style.transition = 'opacity 0.3s ease';
                                requestAnimationFrame(() => {
                                    img.style.opacity = '1';
                                });
                            }
                            img.classList.add('loaded');
                            
                            // Preload next images in carousel
                            preloadNextImages(img);
                        });

                        img.addEventListener('error', () => {
                            hideImageLoader(img);
                            img.style.opacity = '0.5';
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

    function showImageLoader(img) {
        const slide = img.closest('.slide');
        if (slide && !slide.querySelector('.image-loader')) {
            const loader = document.createElement('div');
            loader.className = 'image-loader';
            loader.innerHTML = '<div class="loader-spinner"></div>';
            slide.appendChild(loader);
        }
    }

    function hideImageLoader(img) {
        const slide = img.closest('.slide');
        if (slide) {
            const loader = slide.querySelector('.image-loader');
            if (loader) {
                loader.remove();
            }
        }
    }

    function preloadNextImages(currentImg) {
        const carousel = currentImg.closest('.carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.slide');
        const currentSlide = currentImg.closest('.slide');
        const currentIndex = [...slides].indexOf(currentSlide);
        
        // Preload next 2 images
        for (let i = 1; i <= 2; i++) {
            const nextIndex = (currentIndex + i) % slides.length;
            const nextSlide = slides[nextIndex];
            const nextImg = nextSlide.querySelector('img[loading="lazy"]:not(.loaded)');
            
            if (nextImg) {
                const preloadImg = new Image();
                preloadImg.src = nextImg.src;
            }
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

    // Swup page transitions (optional enhancement)
    if (typeof Swup !== 'undefined') {
        try {
            window.swup = new Swup({
                containers: ['#main-content'],
                animateHistoryBrowsing: true,
                cache: false
            });

            // Use the correct event listener syntax for Swup v4
            if (window.swup && typeof window.swup.hooks === 'object') {
                window.swup.hooks.on('page:view', () => {
                    // Re-initialize carousels
                    initCarousels();
                    
                    // Re-initialize project navigation
                    initProjectNavigation();

                    // Re-initialize lazy loading
                    initLazyLoading();
                });
            }
        } catch (error) {
            console.log('Swup not available or failed to initialize:', error);
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================

    // Initialize lazy loading
    initLazyLoading();

    // Initialize scroll snap
    initScrollSnap();

    // Smooth scroll for anchor links (excluding project navigation)
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not(.project-nav-item)');
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
