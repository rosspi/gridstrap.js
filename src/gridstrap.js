import Constants from './constants';
import {Utils} from './utils';
import {Handlers} from './handlers';
import {Setup} from './setup'; 
import {Internal} from './internal';
import {Methods} from './methods';

(function ($, window, document) {
  $.Gridstrap = function (el, options) {

    if (
      typeof(jQuery) == 'undefined' || 
      !jQuery.Event ||
      !jQuery.Event.prototype.hasOwnProperty('changedTouches')){
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
    gridCellSelector: '>*', // jQuery selector for grid's cells relative to parent element.
    hiddenCellClass: 'gridstrap-cell-hidden', // class applied to 'hidden' cells.
    visibleCellClass: 'gridstrap-cell-visible', // class applied to 'visible' cells.
    nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous',  // class applied to non-contiguous placeholder cells.
    dragCellClass: 'gridstrap-cell-drag', // class applied to dragging cell.
    resizeCellClass: 'gridstrap-cell-resize', // class applied to resizing cell.
    mouseMoveSelector: 'body', // jQuery selector to bind mousemouse and mouseup events.
    visibleCellContainerParentSelector: null, // jQuery selector to append 'visible' cell container to. Null will use the element the plugin is initialised on.
    visibleCellContainerClass: 'gridstrap-container', // class applied to the cell container element.
    getHtmlOfSourceCell: function ($cell) { // function to return the html of a 'source' cell.
      return $cell[0].outerHTML;
    }, 	
    dragCellHandleSelector: '*', // jQuery selector relative to and including cell for drag handling.
    draggable: true, // toggle mouse dragging.
    rearrangeOnDrag: true, // toggle the triggering of rearranging cells before mouseup.
    resizeHandleSelector: null, // jQuery selector relative to cell for resize handling. Null disables.
    resizeOnDrag: true, // toggle mouse resizing.	
    swapMode: false, // toggle swap or insert mode when rearranging cells.
    nonContiguousCellHtml: null, // html to use for non-contiguous placeholder cells.
    autoPadNonContiguousCells: true, // toggle adding non-contiguous cells automatically on drag or as needed.
    updateCoordinatesOnWindowResize: true, // enable window resize event handler.
    debug: false, // toggle console output.
    dragMouseoverThrottle: 150, // throttle cell mouseover events for rearranging.
    windowResizeDebounce: 50,  // debounce redraw on window resize.
    mousemoveDebounce: 0 // debounce mousemove for dragging cells.
  };

  $.fn.gridstrap = function (options) {
    return this.each(function () {
      (new $.Gridstrap(this, options));
    });
  };

})(jQuery, window, document);
