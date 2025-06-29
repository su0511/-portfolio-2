# SUSAN HE Portfolio 2024

A Swiss-inspired minimalist portfolio website featuring clean design, purposeful interactions, and exceptional attention to detail.

## 🎨 Design Philosophy

This portfolio embodies Swiss design principles:
- **Extreme Minimalism**: Large whitespace and clean layouts
- **Strong Grid System**: 12-column CSS Grid with 1400px max-width
- **Typography Hierarchy**: Avenir Next system (Bold/Medium/Regular)
- **Monochromatic Palette**: Pure whites, blacks, and functional grays
- **Functional Design**: Every element serves a clear purpose

## 📁 File Structure

```
├── index.html          # Hero page with loading screen
├── work.html           # Main portfolio gallery
├── styles.css          # Complete Swiss design system
├── script.js           # Interactive functionality
├── test.html           # Implementation test page
└── media/              # Project assets and manifests
```

## 🚀 Features

### Fixed UI Elements (All Pages)
- **Top-left**: "HELLO SUSAN HE"
- **Top-right**: "XUESONG" (brand subtitle)
- **Bottom-right**: "WORK" / "INFO" navigation
- **Bottom-left**: "© 2024 ALL RIGHTS RESERVED."

All elements use vertical text (`writing-mode: vertical-rl`) with 36px margins.

### Loading Screen (index.html)
- Full-screen "Loading Susan He..." text
- 2.4-second progress bar animation
- Smooth slide-up transition to main content
- Automatic DOM cleanup after completion

### Hero Page (index.html)
- Centered large "S" logo (clamp(160px, 30vw, 380px))
- Click or scroll triggers navigation to work.html
- Subtle breathing animation on logo
- Keyboard navigation support (Enter, Space, Arrow Down)

### Works Gallery (work.html)
- **Project Cards**: 8-column carousel + 4-column info layout
- **Carousel System**: Touch/swipe support, keyboard navigation
- **Lightbox**: Full-screen image viewer with ESC/arrow key controls
- **Scroll Snap**: Smooth project-to-project navigation (160px/100px/64px spacing)
- **Info Section**: Contact details and social links

### Interactive Elements
- **Custom Cursor**: 16px circle, scales to 1.25x on hover
- **Image Lazy Loading**: Fade-in animation with IntersectionObserver
- **Touch Optimization**: `touch-action: manipulation` for mobile
- **Accessibility**: Full keyboard navigation, ARIA labels, focus management

## 🎯 Technical Implementation

### CSS Architecture
- **Swiss Color System**: `--color-white`, `--color-black`, `--color-dark`, `--color-gray-line`
- **Typography Scale**: Avenir Next → Inter → Helvetica Neue fallback
- **Responsive Breakpoints**: 480px, 768px, 1024px, 1280px
- **Grid System**: CSS Grid with 12 columns, 2rem gap

### JavaScript Features
- **Carousel Class**: Modular carousel with touch/keyboard support
- **Lightbox Class**: Semantic `<dialog>` element with full navigation
- **Lazy Loading**: Performance optimization with fade-in effects
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

### Accessibility
- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support for all features
- **Focus Management**: Proper focus handling in lightbox
- **Screen Reader Support**: Semantic HTML structure
- **High Contrast**: Support for `prefers-contrast: high`

## 📱 Responsive Design

### Desktop (≥1280px)
- Full 12-column grid layout
- 8-column carousel + 4-column info
- All animations and hover effects active

### Tablet (768px - 1024px)
- Adjusted grid spacing
- Maintained carousel functionality
- Optimized touch interactions

### Mobile (≤768px)
- Single-column layout for project content
- Horizontal navigation text
- Touch-optimized carousel controls
- Simplified interactions

## 🔧 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **CSS Features**: CSS Grid, Custom Properties, Intersection Observer
- **JavaScript**: ES6+ features with graceful degradation
- **Fallbacks**: Helvetica Neue for Avenir Next, auto cursor for touch devices

## 🎨 Customization Areas

The design allows customization in these specific areas only:

1. **Hero Logo**: Replace SVG "S" with any logo or Lottie animation
2. **Project Content**: Adjust right-column text length as needed
3. **Media Assets**: Update project images and manifest files

All other layout, typography, colors, and interactions must remain unchanged per Swiss design principles.

## 🚀 Getting Started

1. **Local Development**:
   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **Test Implementation**:
   ```bash
   # Visit http://localhost:8000/test.html
   ```

3. **Validate Code**:
   ```bash
   node -c script.js  # Check JavaScript syntax
   ```

## 📊 Performance

- **Lazy Loading**: Images load only when needed
- **Optimized Assets**: WebP support with fallbacks
- **Minimal JavaScript**: ~15KB compressed
- **CSS Optimization**: Single stylesheet, no external dependencies
- **Touch Performance**: `touch-action: manipulation` prevents delays

## 🎯 Swiss Design Compliance

This implementation strictly follows Swiss design principles:
- **Objective Typography**: Avenir Next system hierarchy
- **Mathematical Grid**: Precise 12-column alignment
- **Functional Color**: Monochromatic with purpose-driven grays
- **Asymmetric Balance**: Careful weight distribution
- **Negative Space**: Generous whitespace as design element
- **Clarity**: Every element serves a clear function

---

**Built with Swiss precision for timeless design.**
