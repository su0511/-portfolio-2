/**
 * Classic Structured Portfolio - JavaScript
 * Minimal, purposeful interactions for a timeless design
 */

document.addEventListener('DOMContentLoaded', function() {
    // 自定义光标功能
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    if (cursor && cursorDot) {
        // 光标跟随鼠标移动
        document.addEventListener('mousemove', function(e) {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });

        // 鼠标悬停在可交互元素上的效果
        const interactiveElements = document.querySelectorAll(
            'a, button, .portfolio-item, .archive-item, .burger, input, textarea, [role="button"]'
        );

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
            });

            element.addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
            });
        });

        // 鼠标离开页面时隐藏光标
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    }

    // 其他功能代码
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Toggle mobile menu function
    function toggleMobileMenu() {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        // Update aria-expanded for accessibility
        const isExpanded = navLinks.classList.contains('nav-active');
        burger.setAttribute('aria-expanded', isExpanded);

        // Simple fade animation for links (only if motion is not reduced)
        if (!prefersReducedMotion) {
            navLinksItems.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.3s ease forwards ${index * 0.1}s`;
                }
            });
        }
    }

    // Mobile menu event listeners
    if (burger) {
        burger.addEventListener('click', toggleMobileMenu);

        burger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
    }

    // Close mobile menu function
    function closeMobileMenu() {
        navLinks.classList.remove('nav-active');
        burger.classList.remove('toggle');
        burger.setAttribute('aria-expanded', 'false');
        navLinksItems.forEach(item => {
            item.style.animation = '';
        });
    }

    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target) || burger.contains(event.target);

        if (!isClickInsideNav && navLinks.classList.contains('nav-active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('nav-active')) {
            closeMobileMenu();
        }
    });

    // Smooth scrolling for navigation links (only for same-page anchors)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Check if it's a cross-page link (contains .html)
            if (href.includes('.html')) {
                return; // Let the browser handle the navigation
            }

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Subtle navbar scroll effect
    let ticking = false;

    function updateNavbar() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Form enhancement
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Simple form validation feedback
            const submitButton = contactForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual form handling)
            setTimeout(() => {
                submitButton.textContent = 'Message Sent';
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    contactForm.reset();
                }, 2000);
            }, 1000);
        });
    }

    // Lightbox functionality for archive page
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const archiveImages = document.querySelectorAll('[data-lightbox="true"]');

    // Open lightbox when clicking on archive images
    archiveImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            lightboxImage.src = this.src;
            lightboxImage.alt = this.alt;
            lightbox.style.display = 'block';

            // Prevent body scroll when lightbox is open
            document.body.style.overflow = 'hidden';

            // Focus management for accessibility
            lightboxClose.focus();
        });
    });

    // Close lightbox function
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        lightboxImage.src = '';
        lightboxImage.alt = '';
    }

    // Close lightbox when clicking the close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
            closeLightbox();
        }
    });
});