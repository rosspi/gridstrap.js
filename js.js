(function($, window, document){
    $.Gridstrap = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        base._internal = {
            constants: {
                DATA_HIDDEN_CELL : 'hidden-cell',
                DATA_MOUSEDOWN_CELL_POSITION : 'mousedown-cell-position',
                DATA_MOUSEDOWN_SCREEN_POSITION : 'mousedown-screen-position',
                DATA_CELL_POSITION_AND_SIZE : 'position-size',
                RECENT_DRAG_MOUSEOVER_THROTTLE: 500
            },
            cells: [],
            draggedCellSelector: null, // initialised in init()
            setVisibleCellPositionAndSize : function($cell, positionNSize){ 

                // relied upon when drag-stop. 
                $cell.data(base._internal.constants.DATA_CELL_POSITION_AND_SIZE, positionNSize);
                
                $cell.css('top', positionNSize.y);
                $cell.css('left', positionNSize.x);
                $cell.css('width', positionNSize.w);
                $cell.css('height', positionNSize.h); 
            },
            recentDragMouseOvers: [], // tuple of element and timestamp
            lastMouseMovePageCoordinates: {pageX:0, pageY:0},
            lastMouseOverCellTarget: null // for rearranging on mouseup
        };
        
        // Add a reverse reference to the DOM object
        base.$el.data('Gridstrap', base);
        
        base.init = function(){
            base.options = $.extend({},$.Gridstrap.defaultOptions, options);
             
            // turn class name/list into selector.
            base._internal.draggedCellSelector = base.options.draggedCellClass.replace(/(^ *| +)/g, '.') + ':first';
            
            // Put your initialization code here
            //console.log('this is');
           // console.log(base);

            var initHiddenCopiesAndSetAbsolutePositions = function(){
                var cells = base.$el.find(base.options.gridCellSelector);
                cells.each(function(e) {
                    var $this = $(this);
                    base._internal.cells.push($this);

                    var htmlToClone = base.options.getHtmlOfSourceCell($this);
                    var positionNSize = base.options.getAbsolutePositionAndSizeOfCell($this); 

                    $this.before(htmlToClone);
                    var $hiddenClone = $this.prev();

                    $hiddenClone.addClass(base.options.hiddenCellClass);                    
                    $this.addClass(base.options.visibleCellClass);

                    $this.data(base._internal.constants.DATA_HIDDEN_CELL, $hiddenClone); 

                    base._internal.setVisibleCellPositionAndSize($this, positionNSize); 
                });
            };

            var dragstart = function(e){
                e.preventDefault(); 
            };

            var mousedown = function(e){ 
                console.log('down');
                var $toBeDragged = $(this);
                if (!$toBeDragged.hasClass(base.options.draggedCellClass)){
                    $toBeDragged.data(base._internal.constants.DATA_MOUSEDOWN_SCREEN_POSITION, {
                        x: e.pageX,
                        y: e.pageY
                    }); 
                    $toBeDragged.data(base._internal.constants.DATA_MOUSEDOWN_CELL_POSITION, base.options.getAbsolutePositionAndSizeOfCell($toBeDragged)); 
                    
                    $toBeDragged.addClass(base.options.draggedCellClass);
 
                    moveDraggedCell($toBeDragged, e);
                }
            }; 

            var swapJQueryElements = function($a, $b){
                var getInPlaceFunction = function($element){
                    var $other = $a.is($element) ? $b : $a;
                    var $next = $element.next();
                    var $prev = $element.prev();
                    var $parent = $element.parent();
                    // cannot swap a with b exactly if there are no other siblings.
                    if ($next.length > 0 && !$next.is($other)){
                        return function($newElement){
                            $next.before($newElement);
                        }
                    } else if ($prev.length > 0 && !$prev.is($other)){
                        return function($newElement){
                            $prev.after($newElement);
                        }
                    } else {
                        // no siblings, so can just use append
                        return function($newElement){
                            $parent.append($newElement);
                        }
                    }
                };

                var aInPlaceFunc = getInPlaceFunction($a);
                var bInPlaceFunc = getInPlaceFunction($b);
                var $aDetached = $a.detach();
                var $bDetached = $b.detach();
                // swap finally.
                bInPlaceFunc($aDetached);
                aInPlaceFunc($bDetached); 
            };

            var detachAndInsertInPlaceJQueryElement = function($detachElement, $inPlaceElement) {
                var inPlaceElementIndex = $inPlaceElement.index();
                var detachElementIndex = $detachElement.index();

                var $detachedElement = $detachElement.detach();

                if (inPlaceElementIndex < detachElementIndex){
                    $inPlaceElement.before($detachedElement);
                } else {
                    $inPlaceElement.after($detachedElement);
                }
            };

            var setAndGetElementRecentlyDraggedMouseOver = function(element) {
                var d = new Date();
                var n = d.getTime(); 
                for(var i = 0; i < base._internal.recentDragMouseOvers.length; i++){
                    if (base._internal.recentDragMouseOvers[i].n + base._internal.constants.RECENT_DRAG_MOUSEOVER_THROTTLE < n){
                        // expired.
                        base._internal.recentDragMouseOvers.splice(i, 1);
                    }
                    if (i < base._internal.recentDragMouseOvers.length && $(base._internal.recentDragMouseOvers[i].e).is(element)){
                        return true;
                    }
                }
                base._internal.recentDragMouseOvers.push({
                    n: n,
                    e: element
                });
                return false;
            }

            var mouseover = function(mouseEvent){
                // clear initially.
                base._internal.lastMouseOverCellTarget = null;

                var $draggedCell = $(base._internal.draggedCellSelector);
                if ($draggedCell.length > 0){
                    // Is currently dragging.
                    var $cellOfTarget = getManagedCellElementIsWithin(mouseEvent.target);
                    if ($cellOfTarget && $draggedCell.closest($cellOfTarget).length == 0){
                        // make sure you're not mouseover-ing the dragged cell itself.
                        // css' 'pointer-events', 'none' should do this job, but this double checks.
                            
                        base._internal.lastMouseOverCellTarget = $cellOfTarget;

                        if (!setAndGetElementRecentlyDraggedMouseOver($cellOfTarget)) {
                            // do not move two cells that have recently already moved.

                            if (base.options.rearrangeWhileDragging){
                                var $hiddenTarget = $cellOfTarget.data(base._internal.constants.DATA_HIDDEN_CELL);
                                var $hiddenDragged = $draggedCell.data(base._internal.constants.DATA_HIDDEN_CELL);

                                if (base.options.swapMode) {
                                    swapJQueryElements($hiddenDragged, $hiddenTarget); 
                                } else {
                                    detachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget); 
                                } 

                                base.updateVisibleCellCoordinates();
                                
                                // reset dragged object to mouse pos, not pos of hidden cells.
                                // don't pass mouseEvent here because mousedown doesn't have pageX, pageY.
                                moveDraggedCell($draggedCell, base._internal.lastMouseMovePageCoordinates); 
                            }
                            $cellOfTarget.css('opacity', Math.random()); // TODO Remove
                        }
                    }
                }
            };

            var mouseup = function (e) {
                var $dragged = $(base._internal.draggedCellSelector);
                if ($dragged.length > 0){ 

                    // no more dragging.
                    $dragged.removeClass(base.options.draggedCellClass);
                    $dragged.removeData(base._internal.constants.DATA_MOUSEDOWN_SCREEN_POSITION); 
                    
                    var cellOriginalPosition = $dragged.data(base._internal.constants.DATA_CELL_POSITION_AND_SIZE);
                    base._internal.setVisibleCellPositionAndSize($dragged, cellOriginalPosition);  

                    if (base._internal.lastMouseOverCellTarget){
                        if (!base.options.rearrangeWhileDragging){
                            // just rearrange on mouseup
                            var $hiddenTarget = $cellOfTarget.data(base._internal.constants.DATA_HIDDEN_CELL);
                            var $hiddenDragged = $draggedCell.data(base._internal.constants.DATA_HIDDEN_CELL);

                            if (base.options.swapMode) {
                                swapJQueryElements($hiddenDragged, $hiddenTarget); 
                            } else {
                                detachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget); 
                            } 

                            base.updateVisibleCellCoordinates();
                        }
                    }
                }
            }; 

            var getManagedCellElementIsWithin = function(element) {
                if (!element){
                    return null;
                }
                var $managedCell = null;
                var $potential = $(element);
                for(var i = 0; i < base._internal.cells.length && !$managedCell; i++){
                    if ($potential.closest(base._internal.cells[i]).length > 0){
                        $managedCell = base._internal.cells[i];
                    }
                }
                return $managedCell;
            };

            var moveDraggedCell = function($cell, mouseEvent){
                // user can do something custom for dragging if they want.
                var callbackResult = base.options.mouseMoveDragCallback($cell, mouseEvent);
                if (!callbackResult && typeof(callbackResult) === 'boolean'){
                    return;
                }

                var originalMouseDownCellPosition = $cell.data(base._internal.constants.DATA_MOUSEDOWN_CELL_POSITION);
                var originalMouseDownScreenPosition = $cell.data(base._internal.constants.DATA_MOUSEDOWN_SCREEN_POSITION);

                base.options.setPositionOfDraggedCell(originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent);
                
                //now remove mouse events from dragged cell, because we need to test for overlap of underneath things.
                var oldPointerEvents = $cell.css('pointer-events'); 
                $cell.css('pointer-events', 'none');

                var element = document.elementFromPoint(mouseEvent.pageX, mouseEvent.pageY);
                var $cellOfElement = getManagedCellElementIsWithin(element);
                if ($cellOfElement){
                    $cellOfElement.trigger('mouseover');
                }
                $cell.css('pointer-events', oldPointerEvents);
            };

            // only call event if occured on one of managed cells that has been initialised.
            var onCellMouseEvent = function(eventName, callback){

                // the cell itself OR any dragCellHandleSelector within the cell.
                var draggableSelector = base.options.gridCellSelector + ',' + base.options.gridCellSelector + ' ' + base.options.dragCellHandleSelector;

                base.$el.on(eventName, draggableSelector, function(e){
                    var $cellDragElement = $(e.target);
                    var $managedCell = getManagedCellElementIsWithin($cellDragElement);
                    // user clicked on perhaps child element of draggable element.
                    // always send cell itself as 'this' for mouse event handlers.
                    if ($managedCell) {
                        callback.call($managedCell[0], e);
                    }
                });
            };
            
            onCellMouseEvent('dragstart', dragstart);
            onCellMouseEvent('mousedown', mousedown); 
            onCellMouseEvent('mouseover', mouseover); 
            onCellMouseEvent('mouseup', mouseup); 

            $(base.options.mouseMoveSelector).on('mousemove', function(mouseEvent){               
                // These coordinates are needed for when we move dragged objects around in grid.
                // Other mouse events do not have pageX, pageY values.
                base._internal.lastMouseMovePageCoordinates = {
                    pageX: mouseEvent.pageX,
                    pageY: mouseEvent.pageY
                };

                var $draggedCell = $(base._internal.draggedCellSelector);
                if ($draggedCell.length > 0){ // should just be one.
                    moveDraggedCell($draggedCell, mouseEvent);
                }
            });

            initHiddenCopiesAndSetAbsolutePositions();
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // }; 
        base.updateVisibleCellCoordinates = function(){
            for (var i = 0; i < base._internal.cells.length; i++) {
                var $this = base._internal.cells[i]; 

                var $hiddenClone = $this.data(base._internal.constants.DATA_HIDDEN_CELL);
                
                var positionNSizeOfHiddenClone = base.options.getAbsolutePositionAndSizeOfCell($hiddenClone);  
                
                base._internal.setVisibleCellPositionAndSize($this, positionNSizeOfHiddenClone);
            } 
        };

        base.insertCell = function(index, html){
            // todo
        };
        
        
        // Run initializer
        base.init();
    };
    
    $.Gridstrap.defaultOptions = {
        gridCellSelector: '>*', // relative to parent element
        hiddenCellClass: 'gridstrap-cell-hidden',
        visibleCellClass: 'gridstrap-cell-visible',
        dragCellHandleSelector: '*', // relative to and including cell element.
        draggedCellClass: 'gridstrap-cell-drag',
        mouseMoveSelector: 'body',
        //gridOverlayClass: 'grid-overlay',
        getAbsolutePositionAndSizeOfCell: function($cell){

            // var rect = $cell[0].getBoundingClientRect();
            // return {
            //     x: rect.left,
            //     y: rect.top,
            //     w: rect.width,
            //     h: rect.height
            // };
            var position = $cell.offset();
            var w = $cell.outerWidth();
            var h = $cell.outerHeight();
            return {
                x: position.left,
                y: position.top,
                w: w,
                h: h
            };
        },
        getHtmlOfSourceCell: function($cell){
            return $cell[0].outerHTML;
        },
        setPositionOfDraggedCell: function(originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent) {
            var left = mouseEvent.pageX + originalMouseDownCellPosition.x - originalMouseDownScreenPosition.x;
            var top = mouseEvent.pageY + originalMouseDownCellPosition.y - originalMouseDownScreenPosition.y;
            $cell.css('left', left);
            $cell.css('top', top);
            console.log({left:left, top:top});
        },
        mouseMoveDragCallback: function($cell, mouseEvent){
            // do whatever you want.
            // return false to prevent normal operation.
        },
        rearrangeWhileDragging: true,
        swapMode: true,
        contiguous: true
    };
    
    $.fn.gridstrap = function(options){
        return this.each(function(){
            (new $.Gridstrap(this, options));
        });
    };
    
})(jQuery, window, document);
 