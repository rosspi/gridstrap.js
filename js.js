(function($){
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
                DATA_CELL_POSITION_AND_SIZE : 'position-size'
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
            }
        };
        
        // Add a reverse reference to the DOM object
        base.$el.data('Gridstrap', base);
        
        base.init = function(){
            base.options = $.extend({},$.Gridstrap.defaultOptions, options);
             
            base._internal.draggedCellSelector = base.options.draggedCellClass.replace(/(^ *| +)/g, '$1.');
            
            // Put your initialization code here
            //console.log('this is');
           // console.log(base);

            var initHiddenCopiesAndSetAbsolutePositions = function(){
                var cells = base.$el.find(base.options.gridItemSelector);
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

                $(this).addClass(base.options.draggedCellClass);
            };
            var dragenter = function(e){
                $(this).addClass('over'); 
            };
            var dragover = function(e){
                if (e.preventDefault) {
                    e.preventDefault(); // Necessary. Allows us to drop.
                }

                var dt = e.dataTransfer || e.originalEvent.dataTransfer;

                dt.dropEffect = 'move';  // See the section on the DataTransfer object.

                return false;
            };
            var dragleave = function(e){
                $(this).removeClass('over'); 
            };

            var drop = function(e) {
                // this / e.target is current target element.

                if (e.stopPropagation) {
                    e.stopPropagation(); // stops the browser from redirecting.
                }

                // See the section on the DataTransfer object.

                return false;
            }

            var dragEnd = function (e) {
                // this/e.target is the source node.

                $(e.target).each(function(e){
                    $(this).removeClass('over');
                });
                // [].forEach.call(cols, function (col) {
                //     col.classList.remove('over');
                // });
            }; 

            // only call event if occured on one of managed cells that has been initialised.
            var onCellEvent = function(eventName, callback){
                base.$el.on(eventName, base.options.gridItemSelector, function(e){
                    var $cell = $(e.target);
                    var managedCell = false;
                    for(var i = 0; i < base._internal.cells.length && !managedCell; i++){
                        if (base._internal.cells[i].is($cell)){
                            managedCell = true;
                        }
                    }
                    if (managedCell) {
                        callback.call(this, e);
                    }
                });
            };
            
            onCellEvent('dragstart', dragstart);
            //base.$el.on('dragstart', base.options.gridItemSelector, dragstart);
            //$('.column').on('dragenter', dragenter);
            // base.$el.on('dragenter', cellSelectorAndChildren, dragenter);
            // base.$el.on('dragover', cellSelector, dragover);
            // base.$el.on('dragleave', cellSelectorAndChildren, dragleave);
            // base.$el.on('drop', cellSelector, drop);
            // base.$el.on('dragend', cellSelector, dragEnd);

            initHiddenCopiesAndSetAbsolutePositions();

            $(base.options.mouseMoveSelector).on('mousemove', function(mouseEvent){
                var $draggedCell = $(base._internal.draggedCellSelector);
                if ($draggedCell.length > 0){
                    $draggedCell.each(function(e){
                        base.options.setPositionOfDraggedCell($(this), mouseEvent);
                    })
                }
            });
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
        gridItemSelector: '*',
        hiddenCellClass: 'gridstrap-cell-hidden',
        visibleCellClass: 'gridstrap-cell-visible',
        draggedCellClass: 'gridstrap-cell-drag',
        mouseMoveSelector: 'body',
        //gridOverlayClass: 'grid-overlay',
        getAbsolutePositionAndSizeOfCell: function($cell){
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
        setPositionOfDraggedCell: function($cell, mouseEvent) {
            $cell.css('left', mouseEvent.pageX);
            $cell.css('top', mouseEvent.pageY);
        },
        contiguous: true
    };
    
    $.fn.gridstrap = function(options){
        return this.each(function(){
            (new $.Gridstrap(this, options));
        });
    };
    
})(jQuery);

// // dingbjrga
// $(function(){
//     // function handleDragStart(e) {
//     //     this.style.opacity = '0.4';  // this / e.target is the source node.
//     // }

//     // var cols = $('.column').each(function(e){
        
//     // });
//     // [].forEach.call(cols, function(col) {
//     // col.addEventListener('dragstart', handleDragStart, false);
//     // });

//     var dragstart = function(e){
//         this.style.opacity = '0.4';
//     };
//     var dragenter = function(e){
//         $(this).addClass('over'); 
//     };
//     var dragover = function(e){
//         if (e.preventDefault) {
//             e.preventDefault(); // Necessary. Allows us to drop.
//         }

//         var dt = e.dataTransfer || e.originalEvent.dataTransfer;

//         dt.dropEffect = 'move';  // See the section on the DataTransfer object.

//         return false;
//     };
//     var dragleave = function(e){
//         $(this).removeClass('over'); 
//     };

//     var drop = function(e) {
//         // this / e.target is current target element.

//         if (e.stopPropagation) {
//             e.stopPropagation(); // stops the browser from redirecting.
//         }

//         // See the section on the DataTransfer object.

//         return false;
//     }

//     var dragEnd = function (e) {
//         // this/e.target is the source node.

//         $(e.target).each(function(e){
//             $(this).removeClass('over');
//         });
//         // [].forEach.call(cols, function (col) {
//         //     col.classList.remove('over');
//         // });
//     };

//     var gridSelector = '#abc';
//     var cellSelector = '.column'; 
//     var cellSelectorAndChildren = '.column,.column *'; 
    
//     $(gridSelector).on('dragstart', cellSelector, dragstart);
//     //$('.column').on('dragenter', dragenter);
//     $(gridSelector).on('dragenter', cellSelectorAndChildren, dragenter);
//     $(gridSelector).on('dragover', cellSelector, dragover);
//     $(gridSelector).on('dragleave', cellSelectorAndChildren, dragleave);
//     $(gridSelector).on('drop', cellSelector, drop);
//     $(gridSelector).on('dragend', cellSelector, dragEnd);

// });