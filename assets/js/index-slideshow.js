/**
 * Index Page Portfolio Slideshow
 * Hover-triggered media carousel for portfolio items
 */

class PortfolioSlideshow {
    constructor() {
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        this.slideshows = new Map();
        this.init();
    }

    init() {
        this.portfolioItems.forEach(item => {
            const projectId = item.getAttribute('data-project');
            if (projectId) {
                this.setupPortfolioItem(item, projectId);
            }
        });
    }

    async setupPortfolioItem(item, projectId) {
        const imageContainer = item.querySelector('.portfolio-image');
        if (!imageContainer) return;

        // Get media list for this project
        const mediaList = await this.getMediaList(projectId);
        if (mediaList.length <= 1) return; // No slideshow needed for single media

        // Setup slideshow data
        const slideshowData = {
            container: imageContainer,
            mediaList: mediaList,
            currentIndex: 0,
            interval: null,
            isHovering: false
        };

        this.slideshows.set(item, slideshowData);

        // Setup hover events
        item.addEventListener('mouseenter', () => this.startSlideshow(item));
        item.addEventListener('mouseleave', () => this.stopSlideshow(item));

        // Preload first few media items
        this.preloadMedia(mediaList.slice(0, 3));
    }

    async getMediaList(projectId) {
        // Try to fetch manifest.json first
        try {
            const response = await fetch(`media/${projectId}/manifest.json`);
            if (response.ok) {
                const manifest = await response.json();
                return manifest.media || [];
            }
        } catch (error) {
            // Fallback to scanning for numbered files
        }

        // Fallback: scan for numbered media files
        const mediaList = [];
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4'];
        
        for (let i = 1; i <= 20; i++) {
            for (const ext of extensions) {
                try {
                    const url = `media/${projectId}/${i}.${ext}`;
                    const response = await fetch(url, { method: 'HEAD' });
                    if (response.ok) {
                        mediaList.push({
                            url: url,
                            type: ext === 'mp4' ? 'video' : 'image'
                        });
                        break; // Found file with this number, move to next
                    }
                } catch (error) {
                    // File doesn't exist, continue
                }
            }
        }

        return mediaList;
    }

    startSlideshow(item) {
        const slideshow = this.slideshows.get(item);
        if (!slideshow || slideshow.isHovering) return;

        slideshow.isHovering = true;
        slideshow.currentIndex = 0;

        // Start the slideshow interval
        slideshow.interval = setInterval(() => {
            this.nextSlide(slideshow);
        }, 5000); // 5 seconds per slide

        // Show first slide immediately
        this.showSlide(slideshow, 0);
    }

    stopSlideshow(item) {
        const slideshow = this.slideshows.get(item);
        if (!slideshow) return;

        slideshow.isHovering = false;
        
        // Clear interval
        if (slideshow.interval) {
            clearInterval(slideshow.interval);
            slideshow.interval = null;
        }

        // Reset to first slide
        slideshow.currentIndex = 0;
        this.showSlide(slideshow, 0);
    }

    nextSlide(slideshow) {
        if (!slideshow.isHovering) return;
        
        slideshow.currentIndex = (slideshow.currentIndex + 1) % slideshow.mediaList.length;
        this.showSlide(slideshow, slideshow.currentIndex);
    }

    showSlide(slideshow, index) {
        const media = slideshow.mediaList[index];
        if (!media) return;

        const container = slideshow.container;
        const currentElement = container.querySelector('img, video');

        if (media.type === 'video') {
            // Create video element
            const video = document.createElement('video');
            video.src = media.url;
            video.autoplay = true;
            video.muted = true;
            video.loop = false;
            video.playsInline = true;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.transition = 'opacity 0.3s ease';

            // Replace current element
            if (currentElement) {
                currentElement.style.opacity = '0';
                setTimeout(() => {
                    container.replaceChild(video, currentElement);
                    video.style.opacity = '1';
                }, 300);
            } else {
                container.appendChild(video);
            }

            // Auto-advance after video duration or 5 seconds max
            video.addEventListener('loadedmetadata', () => {
                const duration = Math.min(video.duration * 1000, 5000);
                if (slideshow.isHovering) {
                    setTimeout(() => {
                        if (slideshow.isHovering) {
                            this.nextSlide(slideshow);
                        }
                    }, duration);
                }
            });

        } else {
            // Create image element
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = `${slideshow.container.closest('.portfolio-item').querySelector('.portfolio-title')?.textContent || 'Portfolio'} - Image ${index + 1}`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.transition = 'opacity 0.3s ease';

            // Replace current element
            if (currentElement) {
                currentElement.style.opacity = '0';
                setTimeout(() => {
                    container.replaceChild(img, currentElement);
                    img.style.opacity = '1';
                }, 300);
            } else {
                container.appendChild(img);
            }
        }
    }

    preloadMedia(mediaList) {
        mediaList.forEach(media => {
            if (media.type === 'video') {
                // Preload video metadata
                const video = document.createElement('video');
                video.src = media.url;
                video.preload = 'metadata';
            } else {
                // Preload image
                const img = new Image();
                img.src = media.url;
            }
        });
    }

    destroy() {
        // Clean up all intervals and event listeners
        this.slideshows.forEach((slideshow, item) => {
            if (slideshow.interval) {
                clearInterval(slideshow.interval);
            }
        });
        this.slideshows.clear();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on index page
    if (document.querySelector('.portfolio-grid')) {
        window.portfolioSlideshow = new PortfolioSlideshow();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.portfolioSlideshow) {
        window.portfolioSlideshow.destroy();
    }
});
