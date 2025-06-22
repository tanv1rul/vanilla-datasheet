import DivResize from './divResize.js';
import formatterPlugin from './formatterPlugin.js'

const resizer = new DivResize('.container', {
  minWidth: 40,
  mobileMinWidth: 40,
  onResize: (wrapper, width) => {
    console.log('Column resized to:', width);
  }
});


window.formatter = new formatterPlugin();