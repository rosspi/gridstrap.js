var popGrid = function ($grid, html, quantity) {
  var computed = html;
  for (var i = 0; i < quantity; i++) {
    if (typeof (html) == 'function') {
      computed = html(i);
    }
    $($grid).append(computed);
  }
};

$(function () {
  popGrid('#basic-grid', function (i) {
    return '<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>';
  }, 36);

  popGrid('#nested-grid', '<div class="col-xs-4 col-sm-2 cell"><div class="inner"><div class="nested-inner-grid"></div></div></div>', 1);
  popGrid('#nested-grid', '<div class="col-xs-4 col-sm-2 cell"><div class="inner"></div></div>', 10);
  popGrid('.nested-inner-grid', '<div class="col-xs-4 col-sm-2 cell nested"><div class="inner nested"></div></div>', 9);

  popGrid('#resize-grid', '<div class="col-xs-2 cell"><div class="inner"><div class="resize"></div></div></div>', 24);

  popGrid('#noncontiguous-grid', '<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>', 12);

  popGrid('#dual1-grid', '<div class="col-xs-1 cell"><div class="inner"></div></div>', 24);
  popGrid('#dual2-grid', '<div class="col-xs-2 cell"><div class="inner"></div></div>', 12);

  popGrid('#api-grid', function () {
    return '<div class="col-xs-' + Math.floor((Math.random() * 4 + 1)).toString() + ' cell"><div class="inner"></div></div>';
  }, 24);

  popGrid('#custom-grid', function () {
    return '<div style="width:' + (Math.random() * 120) + 'px; height:75px; background-color:#' + Math.floor(Math.random() * 0xFFFFFF).toString(16) + ';"></div>';
  }, 36);

  $('#basic-grid').gridstrap({
dragMouseoverThrottle: 150,
//swapMode: true
  });

  $('a[href="#responsive-demo"]').on('shown.bs.tab', function () {
    $('iframe')[0].contentWindow.postMessage({}, '*');
  });

  $('a[href="#nested-demo"]').on('shown.bs.tab', function () {
    $('#nested-grid').gridstrap();
    $('.gridstrap-cell-visible .nested-inner-grid').gridstrap();
  });

  $('a[href="#resize-demo"]').on('shown.bs.tab', function () {
    $('#resize-grid').gridstrap({
      resizeHandleSelector: '.resize' 
    });

    var gridstrap = $('#resize-grid').data('gridstrap');
    $('#resize-grid').off(gridstrap.constants.EVENT_CELL_RESIZE);
    $('#resize-grid').on(gridstrap.constants.EVENT_CELL_RESIZE, function (e) {
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
  });

  $('a[href="#noncontiguous-demo"]').on('shown.bs.tab', function () {
    $('#noncontiguous-grid').gridstrap({
      nonContiguousCellHtml: '<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>',
      swapMode: true,
      rearrangeOnDrag: false,
      autoPadNonContiguousCells: false
     // mousemoveDebounce: 10
    });

    var ncg = $('#noncontiguous-grid').data('gridstrap');
    var $cells = ncg.$getCells(); 
    var finalCellCount = 5 * 12;

    ncg.padWithNonContiguousCells(function(cellCount, nonContiguousCellCount) {
      return cellCount < finalCellCount;
    });

    var moveRandomCell = function(){
      var $cellToMove = $cells.eq(Math.floor(Math.random() * $cells.length));
      var moveToIndex = Math.floor(Math.random() * finalCellCount);

      ncg.moveCell($cellToMove, moveToIndex);
    };

    moveRandomCell();
    moveRandomCell();
    moveRandomCell();
    moveRandomCell();
    moveRandomCell();
  });

  $('a[href="#dual-demo"]').on('shown.bs.tab', function () {
    $('#dual1-grid').gridstrap({
      swapMode: true
    });
    $('#dual2-grid').gridstrap({
    });

    $('#dual1-grid').data('gridstrap').setAdditionalGridstrapDragTarget('#dual2-grid');
    $('#dual2-grid').data('gridstrap').setAdditionalGridstrapDragTarget('#dual1-grid');
  });

  $('a[href="#custom-demo"]').on('shown.bs.tab', function () {
    $('#custom-grid').gridstrap();
  });

  $('a[href="#api-demo"]').on('shown.bs.tab', function () {
    $('#api-grid').gridstrap();
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
      rearrangeOnDrag: $(this).is(':checked')
    });
  });

  $('#move').on('click', function () {
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