# DivResize - ES6 Resizable Columns Plugin

A mobile-first, responsive resizable columns ES6 plugin built with vanilla JavaScript following Material Design principles.

## Features

- **ES6 Module**: Modern JavaScript class-based plugin architecture
- **Mobile-First Design**: Optimized for touch devices with larger handles and better spacing
- **Material Design**: Clean, minimalist styling with proper elevation and typography
- **Independent Column Resizing**: Columns don't auto-expand when others are resized
- **No Text Wrapping**: Text overflows with horizontal scrolling and ellipsis
- **Touch & Mouse Support**: Works seamlessly on both desktop and mobile devices
- **Callback Support**: Hooks for resize events (start, during, end)
- **API Methods**: Programmatic control over column widths
- **Multiple Instances**: Support for multiple resizable containers
- **Memory Safe**: Proper cleanup and event listener management

## File Structure

```
├── index.html          # Main HTML structure with module imports
├── styles.css          # All CSS styling and responsive design
├── divResize.js        # ES6 Plugin class (main plugin file)
├── main.js             # Application initialization file
└── README.md          # This documentation
```

## Quick Start

### Basic Usage

```javascript
// Import the plugin
import DivResize from './divResize.js';

// Initialize with default options
const resizer = new DivResize('.container');
```

### Advanced Usage

```javascript
import DivResize from './divResize.js';

const resizer = new DivResize('.container', {
  minWidth: 120,
  mobileMinWidth: 150,
  mobileBreakpoint: 768,
  
  // Callback functions
  onResizeStart: (wrapper, startWidth) => {
    console.log('Resize started:', startWidth);
  },
  
  onResize: (wrapper, newWidth) => {
    console.log('Resizing to:', newWidth);
  },
  
  onResizeEnd: (wrapper, finalWidth) => {
    console.log('Resize ended:', finalWidth);
  }
});
```

## Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minWidth` | Number | `120` | Minimum column width on desktop (px) |
| `mobileMinWidth` | Number | `150` | Minimum column width on mobile (px) |
| `handleSelector` | String | `'.resize-handle'` | CSS selector for resize handles |
| `wrapperSelector` | String | `'.column-wrapper'` | CSS selector for column wrappers |
| `mobileBreakpoint` | Number | `768` | Screen width threshold for mobile (px) |
| `onResize` | Function | `null` | Callback during resize |
| `onResizeStart` | Function | `null` | Callback when resize starts |
| `onResizeEnd` | Function | `null` | Callback when resize ends |

## API Methods

### Instance Methods

```javascript
// Get current column widths
const widths = resizer.getColumnWidths();

// Set specific column width
resizer.setColumnWidth(0, 300); // Set first column to 300px

// Reset all columns to default
resizer.resetColumns();

// Refresh plugin after DOM changes
resizer.refresh();

// Clean up and destroy instance
resizer.destroy();
```

### Static Methods

```javascript
// Create multiple instances
const instances = DivResize.create('.resizable-container', options);
```

## HTML Structure

Your HTML should follow this structure:

```html
<div class="container">
  <div class="column-wrapper">
    <div class="column">
      <h3>Column Title</h3>
      <p>Column content...</p>
    </div>
    <div class="resize-handle"></div>
  </div>
  
  <div class="column-wrapper">
    <div class="column">
      <h3>Another Column</h3>
      <p>More content...</p>
    </div>
    <div class="resize-handle"></div>
  </div>
  
  <!-- Last column doesn't need resize handle -->
  <div class="column-wrapper">
    <div class="column">
      <h3>Final Column</h3>
      <p>Final content...</p>
    </div>
  </div>
</div>
```

## Usage Examples

### Multiple Containers

```javascript
// Initialize multiple resizable containers
const resizers = DivResize.create('.resizable-section', {
  minWidth: 100,
  onResize: (wrapper, width) => {
    console.log('Container resized:', width);
  }
});
```

### Dynamic Column Management

```javascript
// Add event listeners for external controls
document.getElementById('resetBtn').addEventListener('click', () => {
  resizer.resetColumns();
});

document.getElementById('wideBtn').addEventListener('click', () => {
  resizer.setColumnWidth(0, 400); // Make first column 400px wide
});
```

### Responsive Callbacks

```javascript
const resizer = new DivResize('.container', {
  onResize: (wrapper, width) => {
    // Update other UI elements based on column width
    if (width < 200) {
      wrapper.classList.add('narrow');
    } else {
      wrapper.classList.remove('narrow');
    }
  }
});
```

## Browser Support

- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+
- Mobile browsers with touch event support

## Development

The plugin is built with modern ES6 features:
- Classes and modules
- Arrow functions
- Destructuring
- Template literals
- Default parameters

## Migration from Old Version

If upgrading from the inline script version:

**Old way:**
```html
<script src="script.js"></script>
```

**New way:**
```html
<script type="module" src="main.js"></script>
```

```javascript
// In main.js
import DivResize from './divResize.js';
const resizer = new DivResize('.container');
```