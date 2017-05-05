(function($){
    $.Gridstrap = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        base.cells = [];
        
        // Add a reverse reference to the DOM object
        base.$el.data("Gridstrap", base);
        
        base.init = function(){
            base.options = $.extend({},$.Gridstrap.defaultOptions, options);
            
            // Put your initialization code here
            //console.log('this is');
           // console.log(base);

            var initAbsoluteCopies = function(){
                var cells = base.$el.find(base.options.gridItemSelector);
                cells.each(function(e) {
                    var $this = $(this);

                    var htmlToClone = base.options.getHtmlOfSourceCell($this);
                    var positionNSize = base.options.getAbsolutePositionAndSizeOfCell($this); 

                    $this.after(htmlToClone);
                    var $cloned = $this.next();
                    $this.data('overlay', $cloned);
                    //cloned.css('color', 'purple');
                    $cloned.addClass(base.options.gridOverlayClass);
                    
                    $cloned.css('top', positionNSize.y);
                    $cloned.css('left', positionNSize.x);
                    $cloned.css('width', positionNSize.w);
                    $cloned.css('height', positionNSize.h); 
                    //debugger;

                    base.cells.push($this);
                });
            };

             

            initAbsoluteCopies();
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // }; 
        base.updateOverlay = function(){
            for (var i = 0; i < base.cells.length; i++) {
                var $this = base.cells[i]; 

                var $overlay = $this.data('overlay');
                
                var positionNSize = base.options.getAbsolutePositionAndSizeOfCell($this);  
                
                $overlay.css('top', positionNSize.y);
                $overlay.css('left', positionNSize.x);
                $overlay.css('width', positionNSize.w);
                $overlay.css('height', positionNSize.h); 
            } 
        };

        base.insertCell = function(index, html){

        };
        
        
        // Run initializer
        base.init();
    };
    
    $.Gridstrap.defaultOptions = {
        gridItemSelector: '*',
        gridOverlayClass: 'grid-overlay',
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