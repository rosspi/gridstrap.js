import {Utils} from './utils';

export class Setup { 
  constructor($, window, document, $el, context){ 
    let options = context.options;
    
     // must pick cells before potentially adding child wrapper to selection.
    this.$originalCells = $el.find(options.gridCellSelector);

    this.idPrefix = Utils.GenerateRandomId();

    let wrapperGeneratedId = 'gridstrap-' + this.idPrefix;
    this.visibleCellContainerSelector = '#' + wrapperGeneratedId;

    // drag selector must be within wrapper div. Turn class name/list into selector. 
    this.dragCellSelector = this.visibleCellContainerSelector + ' ' + Utils.ConvertCssClassToJQuerySelector(options.dragCellClass) + ':first';
    this.resizeCellSelector = this.visibleCellContainerSelector + ' ' + Utils.ConvertCssClassToJQuerySelector(options.resizeCellClass) + ':first';
    // visibleCellContainerClassSelector just contains a .class selector, dont prfix with id. Important. Refactor this.
    this.visibleCellContainerClassSelector = Utils.ConvertCssClassToJQuerySelector(options.visibleCellContainerClass) + ':first';
    this.hiddenCellSelector = Utils.ConvertCssClassToJQuerySelector(options.hiddenCellClass);

    // if option not specified, use JQuery element as parent for wrapper.
    options.visibleCellContainerParentSelector = options.visibleCellContainerParentSelector || $el;
    $(options.visibleCellContainerParentSelector).append('<div id="' + wrapperGeneratedId + '" class="' + options.visibleCellContainerClass + '"></div>');

    this.window = window;
    this.document = document;
    this.$ = $;
    this.$el = $el; 
    this.context = context;
  }

  get Window(){
    return this.window;
  }

  get Document(){
    return this.document;
  }

  get jQuery(){
    return this.$;
  }

  get Options(){
    return this.context.options;
  }
  set Options(value){
    this.context.options = value;
  }

  get $Element(){
    return this.$el;
  } 

  // Only used for assigning context when calling options' methods.
  get Context(){
    return this.context;
  }

  get $OriginalCells() {
    return this.$originalCells;
  }

  get IdPrefix(){
    return this.idPrefix;
  }

  get VisibleCellContainerSelector(){
    return this.visibleCellContainerSelector;
  }

  get DragCellSelector(){
    return this.dragCellSelector;
  }

  get ResizeCellSelector(){
    return this.resizeCellSelector;
  }

  get VisibleCellContainerClassSelector(){
    return this.visibleCellContainerClassSelector;
  } 

  get HiddenCellSelector(){
    return this.hiddenCellSelector;
  }  
}