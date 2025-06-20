export default class DivResize {
  constructor(container, options = {}) {
    // Default options
    this.options = {
      minWidth: 120,
      mobileMinWidth: 150,
      handleSelector: '.resize-handle',
      wrapperSelector: '.column-wrapper',
      mobileBreakpoint: 768,
      onResize: null,
      onResizeStart: null,
      onResizeEnd: null,
    };

    // State
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.wrappers = [];
    this.isResizing = false;
    this.currentWrapper = null;
    this.startX = 0;
    this.startWidth = 0;

    if (!this.container) {
      throw new Error('DivResize: Container element not found');
    }

    this.init();
  }

  /**
   * Initialize the plugin
   */
  init() {
    this.wrappers = Array.from(this.container.querySelectorAll(this.options.wrapperSelector));
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to resize handles
   */
  attachEventListeners() {
    this.wrappers.forEach((wrapper, index) => {
      const handle = wrapper.querySelector(this.options.handleSelector);
      if (!handle) return;

      // Store reference for cleanup
      wrapper._divResizeHandlers = {
        mousedown: (e) => this.startResize(e, wrapper),
        touchstart: (e) => this.startResize(e, wrapper)
      };

      handle.addEventListener('mousedown', wrapper._divResizeHandlers.mousedown);
      handle.addEventListener('touchstart', wrapper._divResizeHandlers.touchstart, { passive: false });
    });
  }

  /**
   * Start resize operation
   */
  startResize(e, wrapper) {
    this.isResizing = true;
    this.currentWrapper = wrapper;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    this.startX = clientX;
    this.startWidth = wrapper.offsetWidth;

    // Apply resize cursor and prevent text selection
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    // Global event listeners for resize and stop
    this.globalHandlers = {
      mousemove: (e) => this.doResize(e),
      mouseup: () => this.stopResize(),
      touchmove: (e) => this.doResize(e),
      touchend: () => this.stopResize()
    };

    document.addEventListener('mousemove', this.globalHandlers.mousemove, { passive: false });
    document.addEventListener('mouseup', this.globalHandlers.mouseup);
    document.addEventListener('touchmove', this.globalHandlers.touchmove, { passive: false });
    document.addEventListener('touchend', this.globalHandlers.touchend);

    e.preventDefault();

    // Trigger callback
    if (this.options.onResizeStart) {
      this.options.onResizeStart(wrapper, this.startWidth);
    }
  }

  /**
   * Perform resize operation
   */
  doResize(e) {
    if (!this.isResizing || !this.currentWrapper) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = clientX - this.startX;
    const minWidth = this.isMobile() ? this.options.mobileMinWidth : this.options.minWidth;
    const newWidth = Math.max(minWidth, this.startWidth + diff);

    this.currentWrapper.style.width = `${newWidth}px`;

    e.preventDefault();

    // Trigger callback
    if (this.options.onResize) {
      this.options.onResize(this.currentWrapper, newWidth);
    }
  }

  /**
   * Stop resize operation
   */
  stopResize() {
    if (!this.isResizing) return;

    this.isResizing = false;
    
    // Reset cursor and text selection
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    // Remove global event listeners
    if (this.globalHandlers) {
      document.removeEventListener('mousemove', this.globalHandlers.mousemove);
      document.removeEventListener('mouseup', this.globalHandlers.mouseup);
      document.removeEventListener('touchmove', this.globalHandlers.touchmove);
      document.removeEventListener('touchend', this.globalHandlers.touchend);
    }

    // Trigger callback
    if (this.options.onResizeEnd) {
      const finalWidth = this.currentWrapper ? this.currentWrapper.offsetWidth : 0;
      this.options.onResizeEnd(this.currentWrapper, finalWidth);
    }

    this.currentWrapper = null;
  }

  /**
   * Check if device is mobile based on screen width
   */
  isMobile() {
    return window.innerWidth <= this.options.mobileBreakpoint;
  }

  /**
   * Get current widths of all columns
   */
  getColumnWidths() {
    return this.wrappers.map(wrapper => ({
      element: wrapper,
      width: wrapper.offsetWidth
    }));
  }

  /**
   * Set width of a specific column
   */
  setColumnWidth(index, width) {
    if (this.wrappers[index]) {
      const minWidth = this.isMobile() ? this.options.mobileMinWidth : this.options.minWidth;
      const newWidth = Math.max(minWidth, width);
      this.wrappers[index].style.width = `${newWidth}px`;
      return newWidth;
    }
    return null;
  }

  /**
   * Reset all columns to default width
   */
  resetColumns() {
    this.wrappers.forEach(wrapper => {
      wrapper.style.width = '';
    });
  }

  /**
   * Refresh the plugin (useful after DOM changes)
   */
  refresh() {
    this.destroy();
    this.init();
  }

  /**
   * Destroy the plugin and clean up event listeners
   */
  destroy() {
    // Remove event listeners
    this.wrappers.forEach(wrapper => {
      const handle = wrapper.querySelector(this.options.handleSelector);
      if (handle && wrapper._divResizeHandlers) {
        handle.removeEventListener('mousedown', wrapper._divResizeHandlers.mousedown);
        handle.removeEventListener('touchstart', wrapper._divResizeHandlers.touchstart);
        delete wrapper._divResizeHandlers;
      }
    });

    // Clean up global listeners if still active
    if (this.isResizing && this.globalHandlers) {
      document.removeEventListener('mousemove', this.globalHandlers.mousemove);
      document.removeEventListener('mouseup', this.globalHandlers.mouseup);
      document.removeEventListener('touchmove', this.globalHandlers.touchmove);
      document.removeEventListener('touchend', this.globalHandlers.touchend);
    }

    // Reset state
    this.isResizing = false;
    this.currentWrapper = null;
    this.wrappers = [];
  }

  /**
   * Static method to create multiple instances
   */
  static create(containers, options = {}) {
    const instances = [];
    const containerList = typeof containers === 'string' 
      ? document.querySelectorAll(containers) 
      : containers;

    Array.from(containerList).forEach(container => {
      instances.push(new DivResize(container, options));
    });

    return instances;
  }
}