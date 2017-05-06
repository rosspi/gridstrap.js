(function($, window, document){
    $.Gridstrap = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        var _internal = {
            constants: {
                DATA_HIDDEN_CELL : 'hidden-cell', //two way link
                DATA_VISIBLE_CELL : 'visible-cell', //two way link
                DATA_MOUSEDOWN_CELL_POSITION : 'mousedown-cell-position',
                DATA_MOUSEDOWN_SCREEN_POSITION : 'mousedown-screen-position',
                DATA_CELL_POSITION_AND_SIZE : 'position-size',
                RECENT_DRAG_MOUSEOVER_THROTTLE: 500
            },
            cellsArray: [],
            initCellsHiddenCopyAndSetAbsolutePosition: function($cell) {
                _internal.cellsArray.push($cell);

                var htmlToClone = base.options.getHtmlOfSourceCell($cell);
                var positionNSize = base.options.getAbsolutePositionAndSizeOfCell($cell); 

                $cell.before(htmlToClone);
                var $hiddenClone = $cell.prev();

                $hiddenClone.addClass(base.options.hiddenCellClass);                    
                $cell.addClass(base.options.visibleCellClass);

                // make it ref hidden cloned cell, both ways.
                $cell.data(_internal.constants.DATA_HIDDEN_CELL, $hiddenClone); 
                $hiddenClone.data(_internal.constants.DATA_VISIBLE_CELL, $cell); 
                
                // put absolute $cell in container.
                $(_internal.visibleCellWrapperSelector).append($cell.detach());

                _internal.setVisibleCellPositionAndSize($cell, positionNSize); 
            },
            getManagedCellAndIndexThatElementIsWithin : function(element) {
                if (!element){
                    return {
                        index: -1,
                        $cell: null
                    };
                } 
                var $potential = $(element);
                for (var i = 0; i < _internal.cellsArray.length; i++){
                    if ($potential.closest(_internal.cellsArray[i]).length > 0){
                        return {
                            index: i,
                            $cell: _internal.cellsArray[i]
                        };
                    }
                }
                return {
                    index: -1,
                    $cell: null
                };
            }, 
            hiddenCellsSelector: null, //initialised in init()
            visibleCellWrapperSelector: null, //initialised in init()
            draggedCellSelector: null, // initialised in init()
            setVisibleCellPositionAndSize : function($cell, positionNSize){ 

                // relied upon when drag-stop. 
                $cell.data(_internal.constants.DATA_CELL_POSITION_AND_SIZE, positionNSize);
                
                $cell.css('top', positionNSize.y);
                $cell.css('left', positionNSize.x);
                $cell.css('width', positionNSize.w);
                $cell.css('height', positionNSize.h); 
            },
            recentDragMouseOvers: [], // tuple of element and timestamp
            lastMouseMovePageCoordinates: {pageX:0, pageY:0},
            lastMouseOverCellTarget: null, // for rearranging on mouseup
            moveCell: function($movingCell, $targetCell) { 

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

                var $hiddenTarget = $targetCell.data(_internal.constants.DATA_HIDDEN_CELL);
                var $hiddenDragged = $movingCell.data(_internal.constants.DATA_HIDDEN_CELL);

                if (base.options.swapMode) {
                    swapJQueryElements($hiddenDragged, $hiddenTarget); 
                } else {
                    detachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget); 
                } 

                base.updateVisibleCellCoordinates();
            },

            init: function() {
                base.options = $.extend({},$.Gridstrap.defaultOptions, options);
             
                // turn class name/list into selector.
                _internal.hiddenCellsSelector = base.options.hiddenCellClass.replace(/(^ *| +)/g, '.');
                _internal.draggedCellSelector = base.options.draggedCellClass.replace(/(^ *| +)/g, '.') + ':first';
                
                // Put your initialization code here
                //console.log('this is');
            // console.log(base);

                var genId = function(){
                    return 'gridstrap-' + Math.random().toString(36).substr(2,5) + Math.round(Math.random() * 1000).toString();
                };

                var initHiddenCopiesAndSetAbsolutePositions = function(){
                    var $cells = base.$el.find(base.options.gridCellSelector);

                    var wrapperGenId = genId();
                    _internal.visibleCellWrapperSelector = '#' + wrapperGenId;
                    $(base.options.visibleCellContainerSelector).append('<div id="' + wrapperGenId + '"></div>');
                    
                    $cells.each(function(e) { 
                        _internal.initCellsHiddenCopyAndSetAbsolutePosition($(this)); 
                    });
                };

                var dragstart = function(e){
                    e.preventDefault(); 
                };

                var mousedown = function(e){ 
                    var $toBeDragged = $(this);
                    if (!$toBeDragged.hasClass(base.options.draggedCellClass)){
                        $toBeDragged.data(_internal.constants.DATA_MOUSEDOWN_SCREEN_POSITION, {
                            x: e.pageX,
                            y: e.pageY
                        }); 
                        $toBeDragged.data(_internal.constants.DATA_MOUSEDOWN_CELL_POSITION, base.options.getAbsolutePositionAndSizeOfCell($toBeDragged)); 
                        
                        $toBeDragged.addClass(base.options.draggedCellClass);
    
                        moveDraggedCell($toBeDragged, e);
                    }
                }; 

                var setAndGetElementRecentlyDraggedMouseOver = function(element) {
                    var d = new Date();
                    var n = d.getTime(); 
                    for(var i = 0; i < _internal.recentDragMouseOvers.length; i++){
                        if (_internal.recentDragMouseOvers[i].n + _internal.constants.RECENT_DRAG_MOUSEOVER_THROTTLE < n){
                            // expired.
                            _internal.recentDragMouseOvers.splice(i, 1);
                        }
                        if (i < _internal.recentDragMouseOvers.length && $(_internal.recentDragMouseOvers[i].e).is(element)){
                            return true;
                        }
                    }
                    _internal.recentDragMouseOvers.push({
                        n: n,
                        e: element
                    });
                    return false;
                }

                var mouseover = function(mouseEvent){
                    // clear initially.
                    _internal.lastMouseOverCellTarget = null;

                    var $draggedCell = $(_internal.draggedCellSelector);
                    if ($draggedCell.length > 0){
                        // Is currently dragging.
                        var $cellOfTarget = _internal.getManagedCellAndIndexThatElementIsWithin(mouseEvent.target).$cell;
                        if ($cellOfTarget && $draggedCell.closest($cellOfTarget).length == 0){
                            // make sure you're not mouseover-ing the dragged cell itself.
                            // css' 'pointer-events', 'none' should do this job, but this double checks.
                                
                            _internal.lastMouseOverCellTarget = $cellOfTarget;

                            if (!setAndGetElementRecentlyDraggedMouseOver($cellOfTarget)) {
                                // do not move two cells that have recently already moved.

                                if (base.options.rearrangeWhileDragging){

                                    _internal.moveCell($draggedCell, $cellOfTarget);  
                                    
                                    // reset dragged object to mouse pos, not pos of hidden cells.
                                    // don't pass mouseEvent here because mousedown doesn't have pageX, pageY.
                                    moveDraggedCell($draggedCell, _internal.lastMouseMovePageCoordinates); 
                                } 
                            }
                        }
                    }
                };

                var mouseup = function (e) {
                    var $draggedCell = $(_internal.draggedCellSelector);
                    if ($draggedCell.length > 0){ 

                        // no more dragging.
                        $draggedCell.removeClass(base.options.draggedCellClass);
                        $draggedCell.removeData(_internal.constants.DATA_MOUSEDOWN_SCREEN_POSITION); 
                        
                        var cellOriginalPosition = $draggedCell.data(_internal.constants.DATA_CELL_POSITION_AND_SIZE);
                        _internal.setVisibleCellPositionAndSize($draggedCell, cellOriginalPosition);  

                        if (_internal.lastMouseOverCellTarget){
                            if (!base.options.rearrangeWhileDragging){
                                // just rearrange on mouseup

                                _internal.moveCell($draggedCell, _internal.lastMouseOverCellTarget);   
                            }
                        }
                    }
                };  

                var moveDraggedCell = function($cell, mouseEvent){
                    // user can do something custom for dragging if they want.
                    var callbackResult = base.options.mouseMoveDragCallback($cell, mouseEvent);
                    if (!callbackResult && typeof(callbackResult) === 'boolean'){
                        return;
                    }

                    var originalMouseDownCellPosition = $cell.data(_internal.constants.DATA_MOUSEDOWN_CELL_POSITION);
                    var originalMouseDownScreenPosition = $cell.data(_internal.constants.DATA_MOUSEDOWN_SCREEN_POSITION);

                    base.options.setPositionOfDraggedCell(originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent);
                    
                    //now remove mouse events from dragged cell, because we need to test for overlap of underneath things.
                    var oldPointerEvents = $cell.css('pointer-events'); 
                    $cell.css('pointer-events', 'none');

                    var element = document.elementFromPoint(mouseEvent.pageX, mouseEvent.pageY);
                    var $cellOfElement = _internal.getManagedCellAndIndexThatElementIsWithin(element).$cell;
                    if ($cellOfElement){
                        $cellOfElement.trigger('mouseover');
                    }
                    $cell.css('pointer-events', oldPointerEvents);
                };

                // only call event if occured on one of managed cells that has been initialised.
                var onCellMouseEvent = function(eventName, callback){

                    // the cell itself OR any dragCellHandleSelector within the cell.
                    var draggableSelector = base.options.gridCellSelector + ',' + base.options.gridCellSelector + ' ' + base.options.dragCellHandleSelector;

                    $(_internal.visibleCellWrapperSelector).on(eventName, draggableSelector, function(e){
                        var $cellDragElement = $(e.target);
                        var $managedCell = _internal.getManagedCellAndIndexThatElementIsWithin($cellDragElement).$cell;
                        // user clicked on perhaps child element of draggable element.
                        // always send cell itself as 'this' for mouse event handlers.
                        if ($managedCell) {
                            callback.call($managedCell[0], e);
                        }
                    });
                };

                initHiddenCopiesAndSetAbsolutePositions();
                
                onCellMouseEvent('dragstart', dragstart);
                onCellMouseEvent('mousedown', mousedown); 
                onCellMouseEvent('mouseover', mouseover); 
                onCellMouseEvent('mouseup', mouseup); 

                $(base.options.mouseMoveSelector).on('mousemove', function(mouseEvent){               
                    // These coordinates are needed for when we move dragged objects around in grid.
                    // Other mouse events do not have pageX, pageY values.
                    _internal.lastMouseMovePageCoordinates = {
                        pageX: mouseEvent.pageX,
                        pageY: mouseEvent.pageY
                    };

                    var $draggedCell = $(_internal.draggedCellSelector);
                    if ($draggedCell.length > 0){ // should just be one.
                        moveDraggedCell($draggedCell, mouseEvent);
                    }
                });
            }
        };
        
        // Add a reverse reference to the DOM object
        base.$el.data('Gridstrap', base);
        
        base.updateVisibleCellCoordinates = function(){
            for (var i = 0; i < _internal.cellsArray.length; i++) {
                var $this = _internal.cellsArray[i]; 

                var $hiddenClone = $this.data(_internal.constants.DATA_HIDDEN_CELL);
                
                var positionNSizeOfHiddenClone = base.options.getAbsolutePositionAndSizeOfCell($hiddenClone);  
                
                _internal.setVisibleCellPositionAndSize($this, positionNSizeOfHiddenClone);
            } 
        };

        // returns jquery object of new cell.
        // index is optional.
        base.insertCell = function(cellHtml, index){             
            var $existingVisibleCells = $(base.getCellElements());
            if (typeof(index) === 'undefined'){
                index = $existingVisibleCells.length;
            }

            var $insertedCell;
            if (index === $existingVisibleCells.length){
                if ($existingVisibleCells.length === 0){
                    // the grid is empty.
                    $insertedCell = $(cellHtml).appendTo(base.$el);
                } else { 
                    $insertedCell = $(cellHtml).insertAfter($existingVisibleCells.last().data(_internal.constants.DATA_HIDDEN_CELL));
                }
            } else {
                $insertedCell = $(cellHtml).insertBefore($existingVisibleCells.eq(index).data(_internal.constants.DATA_HIDDEN_CELL));
            } 

            base.attachCell($insertedCell);

            return $insertedCell;
        };

        base.attachCell = function(selector) {

            if (!$(selector).closest(base.$el).is(base.$el)){
                throw 'Cannot attach element that is not a child of gridstrap parent';
            }

            _internal.initCellsHiddenCopyAndSetAbsolutePosition(selector); 

            base.updateVisibleCellCoordinates();
        };

        base.detachCell = function(selector) {

            var cellNIndex = _internal.getManagedCellAndIndexThatElementIsWithin(selector);
            
            var $hiddenClone = cellNIndex.$cell.data(_internal.constants.DATA_HIDDEN_CELL);

            var $detachedVisibleCell = cellNIndex.$cell.detach();

            // remove 'visible' things, and put the cell back where it came from.
            $detachedVisibleCell.css('top', '');
            $detachedVisibleCell.css('left', '');
            $detachedVisibleCell.css('width', '');
            $detachedVisibleCell.css('height', ''); 
            $detachedVisibleCell.removeData(_internal.constants.DATA_HIDDEN_CELL);
            $detachedVisibleCell.removeClass(base.options.visibleCellClass); 

            var $reattachedOriginalCell = $detachedVisibleCell.insertAfter($hiddenClone);

            // remove hidden clone.
            $hiddenClone.remove();  

            // finally remove from managed array
            _internal.cellsArray.splice(cellNIndex.index, 1);   

            return $reattachedOriginalCell;
        };

        base.removeCell = function(selector) {
            
            var $detachedCell = base.detachCell(selector);

            $detachedCell.remove();

            base.updateVisibleCellCoordinates();
        };

        base.moveCell = function(selector, toIndex) {
            var cellNIndex = _internal.getManagedCellAndIndexThatElementIsWithin(selector);

            var existingVisibleCells = base.getCellElements();
            
            _internal.moveCell(cellNIndex.$cell, $(existingVisibleCells[toIndex]));
        };

        base.getCellElements = function(){
            // Get all hidden cloned cells, then see if their linked visible cells are managed. Base their returned order off hidden cell html order. 

            // just find all children and work from there, can't rely on selcting via base.hiddenCellClass because later elements may have been added.
            var $attachedHiddenCells = $(base.$el).find('*').filter(function(){
                var $linkedVisibleCell = $(this).data(_internal.constants.DATA_VISIBLE_CELL);
                if (!$linkedVisibleCell || $linkedVisibleCell.length === 0){
                    return false;
                }
                for(var i = 0; i < _internal.cellsArray.length; i++){
                    if (_internal.cellsArray[i].is($linkedVisibleCell)){
                        return true;
                    }
                }
                return false;
            });

            // cannot map to an array of jquery objects, so map to array of ordinray elements. Jquery can interpret that later ok.
            var attachedVisibleCellElements = $attachedHiddenCells.map(function(){
                return $(this).data(_internal.constants.DATA_VISIBLE_CELL)[0];
            });   

            return attachedVisibleCellElements;         
        }
        
        
        // Initialiser
        _internal.init();
    };
    
    $.Gridstrap.defaultOptions = {
        gridCellSelector: '>*', // relative to parent element
        hiddenCellClass: 'gridstrap-cell-hidden',
        visibleCellClass: 'gridstrap-cell-visible',
        dragCellHandleSelector: '*', // relative to and including cell element.
        draggedCellClass: 'gridstrap-cell-drag',
        mouseMoveSelector: 'body',
        visibleCellContainerSelector: 'body',
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
        },
        mouseMoveDragCallback: function($cell, mouseEvent){
            // do whatever you want.
            // return false to prevent normal operation.
        },
        rearrangeWhileDragging: true,
        swapMode: false,
        contiguous: true
    };
    
    $.fn.gridstrap = function(options){
        return this.each(function(){
            (new $.Gridstrap(this, options));
        });
    };
    
})(jQuery, window, document);
 