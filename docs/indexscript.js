
$(function(){ 
    for (var i = 0 ; i < 12 * 5; i++){
        $('#basic-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>'); 
    }  
    for (var i = 0 ; i < 12; i++){
      if (i === 2){
        $('#nested-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"><div class="nested-inner-grid"></div></div></div>');  
      } else {
        $('#nested-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>');  
      }
      if (i > 2){
        $('.nested-inner-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner nested"></div></div>'); 
      }
    } 

    for (var i = 0 ; i < 12; i++){ 
        $('#noncontiguous-grid').append('<div class="col-xs-'+ Math.floor((Math.random() * 3 + 1)).toString()+' cell"><div class="inner"></div></div>');
    }

    for (var i = 0 ; i < 12 *2; i++){ 
        $('#dual1-grid').append('<div class="col-xs-1 cell"><div class="inner"></div></div>'); 
    }
    for (var i = 0 ; i < 12 ; i++){  
        $('#dual2-grid').append('<div class="col-xs-2 cell"><div class="inner"></div></div>');
    }

    for (var i = 0 ; i < 12 * 2; i++){ 
        $('#api-grid').append('<div class="col-xs-'+ Math.floor((Math.random() * 4 + 1)).toString()+' cell"><div class="inner"></div></div>');
    }

    $('#basic-grid').gridstrap({
         
    });

    $('a[href="#responsive-demo"]').on('shown.bs.tab', function(){ 
        $('iframe')[0].contentWindow.postMessage({} , '*'); 
    });

    $('a[href="#nested-demo"]').on('shown.bs.tab', function(){ 
        $('#nested-grid').gridstrap({
             
        });
        $('.gridstrap-cell-visible .nested-inner-grid').gridstrap({
           //  visibleCellContainerParentSelector: '#nested-demo',
            //visibleCellContainerParentSelector: 'body'
            // getAbsolutePositionAndSizeOfCell: function($cell){
            //   var $parentCell = $cell.parents('.gridstrap-cell-visible');
            //   var parentPosition = $parentCell.offset() || {left: 0, top: 0};

            //   var position = $cell.offset();
            //   var w = $cell.outerWidth();
            //   var h = $cell.outerHeight();
            //   return {
            //     x:  position.left -parentPosition.left ,
            //     y: position.top -  parentPosition.top,
            //     w: w,
            //     h: h
            //   };
            // },
            // setAbsolutePositionAndSizeOfCell: function($cell, positionAndSize){
            //   var $parentCell = $cell.closest('.gridstrap-cell-visible');
            //   var parentPosition = $parentCell.offset() || {left: 0, top: 0};

            //   $cell.css('left', positionAndSize.x + parentPosition.left);
            //   $cell.css('top', positionAndSize.y + parentPosition.top);
            //   $cell.css('width', positionAndSize.w);
            //   $cell.css('height', positionAndSize.h);
            // }
        });
    });

    $('a[href="#noncontiguous-demo"]').on('shown.bs.tab', function(){ 
        $('#noncontiguous-grid').gridstrap({
             nonContiguousOptions: {
                selector: '#gwgwe', 
                getHtml: function(){
                    return '<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>';
                }
            },
        });
    });

    $('a[href="#dual-demo"]').on('shown.bs.tab', function(){ 
        $('#dual1-grid').gridstrap({
         // additionalDragGridstrapTargetSelector: '#dual2-grid',
     //     visibleCellContainerParentSelector: '#dual-demo'
        });
        $('#dual2-grid').gridstrap({ 
       //   visibleCellContainerParentSelector: '#dual-demo'
        });

        $('#dual1-grid').data('gridstrap').setAdditionalGridstrapDragTarget('#dual2-grid');
        $('#dual2-grid').data('gridstrap').setAdditionalGridstrapDragTarget('#dual1-grid');
    });

    $('a[href="#api-demo"]').on('shown.bs.tab', function(){ 
        $('#api-grid').gridstrap({
            debug: true,
          //  visibleCellContainerParentSelector: '#api-demo' // inside a colum its position"relative."
            //visibleCellContainerParentSelector: "#basic-demo"
        });
    }); 

    $('#replace-mode').on('change', function(){
        var data = $('#api-grid').data('gridstrap');
        data.updateOptions({
            swapMode: $(this).is(':checked')
        });
    });

    $('#rearrange-mode').on('change', function(){
        var data = $('#api-grid').data('gridstrap');
        data.updateOptions({
            rearrangeWhileDragging: $(this).is(':checked')
        });
    });


    var interval = setInterval(function(){
        $('iframe').width(Math.random() * ($(window).width() / 1.2) + 100);
    }, 1000);

});