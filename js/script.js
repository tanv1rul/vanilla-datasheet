import DivResize from './divResize.js';

const resizer = new DivResize('.container', {
  minWidth: 120,
  mobileMinWidth: 150,
  onResize: (wrapper, width) => {
    console.log('Column resized to:', width);
  }
});