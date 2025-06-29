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
    // CAROUSEL FUNCTIONALITY (New Structure)
    // ===================================

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

        // Lightbox functionality
        slides.forEach(slide => {
            slide.onclick = (e) => {
                if (!e.target.closest('.arrow')) {
                    openLightbox([...slides].indexOf(slide), slides);
                }
            };
        });
    });

    // ===================================
    // LIGHTBOX FUNCTIONALITY (Updated)
    // ===================================

    function openLightbox(startIdx, slides) {
        const dlg = document.createElement('dialog');
        dlg.className = 'lightbox';
        dlg.innerHTML = `
            <button class="lb-close" aria-label="Close">×</button>
            ${[...slides].map(s => s.innerHTML).join('')}
            <button class="lb-prev" aria-label="Prev">‹</button>
            <button class="lb-next" aria-label="Next">›</button>
        `;
        document.body.append(dlg);
        dlg.showModal();

        let idx = startIdx;
        const imgs = dlg.querySelectorAll('img');
        const render = () => imgs.forEach((im, i) => im.style.display = i === idx ? 'block' : 'none');
        render();

        dlg.querySelector('.lb-next').onclick = () => {
            idx = (idx + 1) % imgs.length;
            render();
        };
        dlg.querySelector('.lb-prev').onclick = () => {
            idx = (idx - 1 + imgs.length) % imgs.length;
            render();
        };
        dlg.querySelector('.lb-close').onclick = () => {
            dlg.close();
            dlg.remove();
        };

        dlg.addEventListener('click', e => {
            if (e.target === dlg) {
                dlg.close();
                dlg.remove();
            }
        });

        document.addEventListener('keydown', e => {
            if (!dlg.open) return;
            if (e.key === 'Escape') {
                dlg.close();
                dlg.remove();
            }
            if (e.key === 'ArrowRight') dlg.querySelector('.lb-next').click();
            if (e.key === 'ArrowLeft') dlg.querySelector('.lb-prev').click();
        });
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
        const swup = new Swup({
            containers: ['#swup'],
            animateHistoryBrowsing: true
        });

        // Re-initialize functionality after page transitions
        swup.on('contentReplaced', function() {
            // Re-initialize carousels
            document.querySelectorAll('.carousel').forEach(carousel => {
                // Carousel initialization code would go here
                // (Same as above carousel initialization)
            });

            // Re-initialize lazy loading
            initLazyLoading();
        });
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