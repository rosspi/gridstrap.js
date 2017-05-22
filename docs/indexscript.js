
$(function () {
  for (var i = 0; i < 12 * 3; i++) {
    $('#basic-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>');
  }
  for (var i = 0; i < 12; i++) {
    if (i === 2) {
      $('#nested-grid').append('<div class="col-xs-4 col-sm-2 cell"><div class="inner"><div class="nested-inner-grid"></div></div></div>');
    } else {
      $('#nested-grid').append('<div class="col-xs-4 col-sm-2 cell"><div class="inner"></div></div>');
    }
    if (i > 2) {
      $('.nested-inner-grid').append('<div class="col-xs-4 col-sm-2 cell nested"><div class="inner nested"></div></div>');
    }
  }

  for (var i = 0; i < 12 * 2; i++) {
    $('#resize-grid').append('<div class="col-xs-2 cell"><div class="inner"><div class="resize"></div></div></div>');
  }

  for (var i = 0; i < 12; i++) {
    $('#noncontiguous-grid').append('<div class="col-xs-1 cell"><div class="inner"></div></div>');
  }

  for (var i = 0; i < 12 * 2; i++) {
    $('#dual1-grid').append('<div class="col-xs-1 cell"><div class="inner"></div></div>');
  }
  for (var i = 0; i < 12; i++) {
    $('#dual2-grid').append('<div class="col-xs-2 cell"><div class="inner"></div></div>');
  }

  for (var i = 0; i < 12 * 2; i++) {
    $('#api-grid').append('<div class="col-xs-' + Math.floor((Math.random() * 4 + 1)).toString() + ' cell"><div class="inner"></div></div>');
  }

  for (var i = 0; i < 12 * 3; i++) {
    $('#custom-grid').append('<div style="width:' + (Math.random() * 120) + 'px; height:75px; background-color:#' + Math.floor(Math.random() * 0xFFFFFF).toString(16) + ';"></div>');
  }

  $('#basic-grid').gridstrap({

  });

  $('a[href="#responsive-demo"]').on('shown.bs.tab', function () {
    $('iframe')[0].contentWindow.postMessage({}, '*');
  });

  $('a[href="#nested-demo"]').on('shown.bs.tab', function () {
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

  $('a[href="#resize-demo"]').on('shown.bs.tab', function () {
    $('#resize-grid').gridstrap({
      resizeHandleSelector: '.resize',
      resizeOnDrag: true,
      debug: true,
      // onResizeCell: function ($cell, width, height) {

      //   var $hiddenCell = $cell.data('gridstrap-hidden-cell');
      //   //var $tempCell = $('<div></div>').appendTo($hiddenCell.parent());
      //   for (var i = 1; i <= 12; i++) {
      //     $hiddenCell.removeClass('col-xs-' + i);
      //   }

      //   //$hiddenCell.addClass('col-xs-1');
      //   // if (!$hiddenCell.filter('[class*="col-xs"]').length){
      //   $hiddenCell.addClass('col-xs-1');
      //   //   }
      //   var oneWidth = $hiddenCell.outerWidth();
      //   for (var i = 2; i <= 12; i++) {
      //     if ($hiddenCell.outerWidth() + oneWidth / 2 <= width) {
      //       $hiddenCell.removeClass('col-xs-' + (i - 1));
      //       $hiddenCell.addClass('col-xs-' + i);
      //     } else {
      //       $hiddenCell.removeClass('col-xs-' + (i));
      //     }
      //   }


      //   this.updateVisibleCellCoordinates();
      // }
    });

    var gridstrap = $('#resize-grid').data('gridstrap');
     $('#resize-grid').off(gridstrap.constants.EVENT_CELL_RESIZE);
    $('#resize-grid').on(gridstrap.constants.EVENT_CELL_RESIZE, function(e){
      e.preventDefault();

      var gs = $(this).data('gridstrap');
      var index = gs.getCellIndexOfElement(e.target); 

      gs.modifyCell(index, function ($getVisibleCell, $getHiddenCell) { 
        var $hiddenCell = $getHiddenCell(); 

        for (var i = 1; i <= 12; i++) {
          $hiddenCell.removeClass('col-xs-' + i);
        } 

        $hiddenCell.addClass('col-xs-1'); 

        var oneWidth = $hiddenCell.outerWidth();
        for (var i = 2; i <= 12; i++) {
          if ($hiddenCell.outerWidth() + oneWidth / 2 <= e.width) {
            $hiddenCell.removeClass('col-xs-' + (i - 1));
            $hiddenCell.addClass('col-xs-' + i);
          } else {
            $hiddenCell.removeClass('col-xs-' + i);
          }
        }
      });
    });

    // gridstrap.modifyCell(2, function (getVisibleCell, getHiddenCell) {
    //   var $visibleCell = getVisibleCell();
    //   var $hiddenCell = getHiddenCell();
    // });
  });

  $('a[href="#noncontiguous-demo"]').on('shown.bs.tab', function () {
    $('#noncontiguous-grid').gridstrap({
      nonContiguousOptions: {
        selector: '#gwgwe',
        getHtml: function () {
          return '<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>';
        }
      },
      swapMode: true,
      mousemoveDebounce: 10
    });
  });

  $('a[href="#dual-demo"]').on('shown.bs.tab', function () {
    $('#dual1-grid').gridstrap({
      swapMode: true
      // additionalDragGridstrapTargetSelector: '#dual2-grid',
      //     visibleCellContainerParentSelector: '#dual-demo'
    });
    $('#dual2-grid').gridstrap({
      //   visibleCellContainerParentSelector: '#dual-demo'
    });

    $('#dual1-grid').data('gridstrap').setAdditionalGridstrapDragTarget('#dual2-grid');
    $('#dual2-grid').data('gridstrap').setAdditionalGridstrapDragTarget('#dual1-grid');
  });

  $('a[href="#custom-demo"]').on('shown.bs.tab', function () {
    $('#custom-grid').gridstrap({
      debug: true,
      //  visibleCellContainerParentSelector: '#api-demo' // inside a colum its position"relative."
      //visibleCellContainerParentSelector: "#basic-demo"
    });
  });

  $('a[href="#api-demo"]').on('shown.bs.tab', function () {
    $('#api-grid').gridstrap({
      debug: true,
      //  visibleCellContainerParentSelector: '#api-demo' // inside a colum its position"relative."
      //visibleCellContainerParentSelector: "#basic-demo"
    });
  });

  $('#swap-mode').on('change', function () {
    var data = $('#api-grid').data('gridstrap');
    data.updateOptions({
      swapMode: $(this).is(':checked')
    });
  });

  $('#rearrange-mode').on('change', function () {
    var data = $('#api-grid').data('gridstrap');
    data.updateOptions({
      rearrangeWhileDragging: $(this).is(':checked')
    });
  });

  $('#move').on('click', function(){
    var data = $('#api-grid').data('gridstrap');
    var $cells = data.$getCells();
    var $randomCell = $cells.eq(Math.floor(Math.random() * $cells.length));

    data.moveCell(
      $randomCell,
      Math.floor((Math.random() * $cells.length))
      );
  });


  var interval = setInterval(function () {
    $('iframe').width(Math.random() * ($(window).width() / 1.2) + 100);
  }, 1000);

});