/**
 * Project Viewer
 * Media carousel and lightbox for project detail pages
 */

class ProjectViewer {
    constructor() {
        this.projectMedia = document.querySelector('.project-media');
        this.mediaList = [];
        this.currentIndex = 0;
        this.lightbox = null;
        this.isLightboxOpen = false;
        
        this.init();
    }

    async init() {
        if (!this.projectMedia) return;

        const projectId = this.projectMedia.getAttribute('data-project');
        if (!projectId) return;

        // Get media list
        this.mediaList = await this.getMediaList(projectId);
        
        if (this.mediaList.length === 0) return;

        // Setup the viewer
        this.setupMediaFrame();
        this.setupNavigation();
        this.setupLightbox();
        this.setupKeyboardControls();
        
        // Preload all media
        this.preloadAllMedia();
        
        // Show first media
        this.showMedia(0);
        
        // Update media count attribute
        this.projectMedia.setAttribute('data-media-count', this.mediaList.length);
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
            // Fallback to scanning
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
                            type: ext === 'mp4' ? 'video' : 'image',
                            alt: `${projectId} - Media ${i}`
                        });
                        break;
                    }
                } catch (error) {
                    // File doesn't exist
                }
            }
        }

        return mediaList;
    }

    setupMediaFrame() {
        const mediaFrame = this.projectMedia.querySelector('.media-frame');
        if (!mediaFrame) {
            // Create media frame
            const frame = document.createElement('div');
            frame.className = 'media-frame';
            this.projectMedia.appendChild(frame);
        }
    }

    setupNavigation() {
        if (this.mediaList.length <= 1) return;

        // Find the project-text container
        const projectText = document.querySelector('.project-text');
        if (!projectText) return;

        // Create navigation container
        const navContainer = document.createElement('div');
        navContainer.className = 'media-nav-container';

        // Create navigation buttons
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav nav-prev';
        prevBtn.innerHTML = '←';
        prevBtn.setAttribute('aria-label', 'Previous media');
        prevBtn.addEventListener('click', () => this.previousMedia());

        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav nav-next';
        nextBtn.innerHTML = '→';
        nextBtn.setAttribute('aria-label', 'Next media');
        nextBtn.addEventListener('click', () => this.nextMedia());

        navContainer.appendChild(prevBtn);
        navContainer.appendChild(nextBtn);

        // Append to project-text instead of project-media
        projectText.appendChild(navContainer);
    }

    setupLightbox() {
        // Create lightbox HTML
        const lightboxHTML = `
            <div class="lightbox" id="project-lightbox">
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox">×</button>
                    <div class="lightbox-nav-zone lightbox-nav-zone-prev"></div>
                    <div class="lightbox-nav-zone lightbox-nav-zone-next"></div>
                    ${this.mediaList.length > 1 ? `
                        <button class="lightbox-nav lightbox-nav-prev" aria-label="Previous media">←</button>
                        <button class="lightbox-nav lightbox-nav-next" aria-label="Next media">→</button>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('project-lightbox');

        // Setup lightbox events
        this.setupLightboxEvents();
    }

    setupLightboxEvents() {
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        const prevBtn = this.lightbox.querySelector('.lightbox-nav-prev');
        const nextBtn = this.lightbox.querySelector('.lightbox-nav-next');
        const prevZone = this.lightbox.querySelector('.lightbox-nav-zone-prev');
        const nextZone = this.lightbox.querySelector('.lightbox-nav-zone-next');

        // Close lightbox
        closeBtn.addEventListener('click', () => this.closeLightbox());
        
        // Click outside to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Navigation
        if (prevBtn) prevBtn.addEventListener('click', () => this.previousMedia());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextMedia());
        if (prevZone) prevZone.addEventListener('click', () => this.previousMedia());
        if (nextZone) nextZone.addEventListener('click', () => this.nextMedia());

        // Media click to open lightbox
        const mediaFrame = this.projectMedia.querySelector('.media-frame');
        mediaFrame.addEventListener('click', () => this.openLightbox());
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isLightboxOpen) return;

            switch (e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousMedia();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextMedia();
                    break;
            }
        });
    }

    showMedia(index) {
        if (index < 0 || index >= this.mediaList.length) return;

        this.currentIndex = index;
        const media = this.mediaList[index];
        
        // Update main viewer
        this.updateMediaFrame(media);
        
        // Update lightbox if open
        if (this.isLightboxOpen) {
            this.updateLightboxMedia(media);
        }
    }

    updateMediaFrame(media) {
        const mediaFrame = this.projectMedia.querySelector('.media-frame');
        const currentElement = mediaFrame.querySelector('img, video');

        if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.url;
            video.autoplay = false;
            video.muted = true;
            video.loop = false;
            video.playsInline = true;
            video.controls = false;
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.cursor = 'zoom-in';

            if (currentElement) {
                mediaFrame.replaceChild(video, currentElement);
            } else {
                mediaFrame.appendChild(video);
            }
        } else {
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = media.alt;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.cursor = 'zoom-in';

            if (currentElement) {
                mediaFrame.replaceChild(img, currentElement);
            } else {
                mediaFrame.appendChild(img);
            }
        }
    }

    updateLightboxMedia(media) {
        const content = this.lightbox.querySelector('.lightbox-content');
        const currentMedia = content.querySelector('.lightbox-media');

        if (currentMedia) {
            currentMedia.remove();
        }

        if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.url;
            video.className = 'lightbox-media';
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.controls = true;
            content.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = media.alt;
            img.className = 'lightbox-media';
            content.appendChild(img);
        }
    }

    openLightbox() {
        this.isLightboxOpen = true;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update lightbox with current media
        this.updateLightboxMedia(this.mediaList[this.currentIndex]);
        
        // Focus close button for accessibility
        const closeBtn = this.lightbox.querySelector('.lightbox-close');
        closeBtn.focus();
    }

    closeLightbox() {
        this.isLightboxOpen = false;
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Pause any videos in lightbox
        const video = this.lightbox.querySelector('video');
        if (video) {
            video.pause();
        }
    }

    nextMedia() {
        const nextIndex = (this.currentIndex + 1) % this.mediaList.length;
        this.showMedia(nextIndex);
    }

    previousMedia() {
        const prevIndex = (this.currentIndex - 1 + this.mediaList.length) % this.mediaList.length;
        this.showMedia(prevIndex);
    }

    preloadAllMedia() {
        this.mediaList.forEach(media => {
            if (media.type === 'video') {
                const video = document.createElement('video');
                video.src = media.url;
                video.preload = 'metadata';
            } else {
                const img = new Image();
                img.src = media.url;
            }
        });
    }

    destroy() {
        if (this.lightbox) {
            this.lightbox.remove();
        }
        this.isLightboxOpen = false;
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on project pages
    if (document.querySelector('.project-media')) {
        window.projectViewer = new ProjectViewer();
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.projectViewer) {
        window.projectViewer.destroy();
    }
});
