import Constants from './constants';
import {Utils} from './utils';
import {Handlers} from './handlers';
import {Setup} from './setup'; 
import {Internal} from './internal';
import {Methods} from './methods';

(function ($, window, document) {
  $.Gridstrap = function (el, options) {

    if (typeof(jQuery) == 'undefined'){
      throw new Error(Constants.ERROR_MISSING_JQUERY);
    }  

    // To avoid scope issues, use 'context' instead of 'this'
    // to reference this class from internal events and functions.
    let context = this;

    // Access to jQuery and DOM versions of element
    context.$el = $(el);
    context.el = el; 
    context.constants = Constants;  
    context.options = $.extend({}, $.Gridstrap.defaultOptions, options);

    // Do nothing if it's already been done before.
    let existingInitialisation = context.$el.data(Constants.DATA_GRIDSTRAP);
    if (existingInitialisation) {
      if (context.options.debug) {
        console.log(`Gridstrap already initialised for element: ${context.el.nodeName}`);
      }
      return;
    } 

    // Add a reverse reference to the DOM object
    context.$el.data(Constants.DATA_GRIDSTRAP, context);

    let setup = new Setup($, window, document, context.$el, context);
    let internal = new Internal(setup);
    let eventHandlers = new Handlers(setup, internal); 
    let methods = new Methods(setup, internal, eventHandlers);

    // copy methods from Methods to context.
    for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(methods))) {
      let method = methods[name];
      // skip constructor
      if (!(method instanceof Function) || method === Methods) continue;
      
      context[name] = method.bind(methods);
    }

    internal.InitOriginalCells(); 
    internal.InitEventHandlers(eventHandlers);   

    if (context.options.debug) {
      console.log(`Gridstrap initialised for element: ${context.el.nodeName}`);
    } 
    // initialised :).
  };

  $.Gridstrap.defaultOptions = {
    gridCellSelector: '>*', // relative to parent element
    hiddenCellClass: 'gridstrap-cell-hidden',
    visibleCellClass: 'gridstrap-cell-visible',
    dragCellHandleSelector: '*', // relative to and including cell element.
    dragCellClass: 'gridstrap-cell-drag',
    resizeCellClass: 'gridstrap-cell-resize',
    mouseMoveSelector: 'body', // detect mousemouse and mouseup events within this element.
    visibleCellContainerParentSelector: null, // null by default, use Jquery parent element.
    visibleCellContainerClass: 'gridstrap-container',
    nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous', 
    getHtmlOfSourceCell: function ($cell) {
      return $cell[0].outerHTML;
    }, 
    enableDragging: true,
    rearrangeWhileDragging: true,
    swapMode: false,
    nonContiguousOptions: {
      selector: null,
      getHtml: function () {
        return null;
      }
    },
    updateCoordinatesOnWindowResize: true,
    debug: false,
    dragMouseoverThrottle: 500, //used for detecting which unique element is mouse-over.
    windowResizeDebounce: 50, 
    resizeHandleSelector: null, // does not resize by default. Relative to cell. 
    resizeOnDrag: true 
  };

  $.fn.gridstrap = function (options) {
    return this.each(function () {
      (new $.Gridstrap(this, options));
    });
  };

})(jQuery, window, document);
