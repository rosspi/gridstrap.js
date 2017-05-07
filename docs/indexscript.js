
$(function(){
    var cellCount = 12 * 5;
 
   // window.
//     var doc = $('iframe')[0].contentWindow.document;
//     doc.open();
//    // doc.write('<script>window.parent.iframeReady(function(){                    $("#responsive-grid").gridstrap(); });;</script>');
//     doc.close(); 

    for (var i = 0 ; i < cellCount; i++){
        $('#basic-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>');
        //$('#responsive-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>');
    }
    $('#basic-grid').gridstrap({
        //visibleCellContainerParentSelector: "#basic-demo"
    });
    $('a[href="#responsive-demo"]').on('shown.bs.tab', function(){
        //var dd = $('iframe')[0].contentWindow.document.getElementById('responsive-grid');
        //window.initResponsiveGridCallback && window.initResponsiveGridCallback();

        $('iframe')[0].contentWindow.postMessage({} , '*');
        // $($('iframe')[0].contentWindow.document.getElementById('responsive-grid')).gridstrap({
        //     //visibleCellContainerParentSelector: "#basic-demo"
        // });
        // var oldWidth = $.width;
        // $.width = function() { 
        //     if ($(this).is($(window))){
        //         alert('window');
        //     }
        //     return oldWidth.call(this);
        // };
        //  $('#responsive-grid').gridstrap({
        //     //visibleCellContainerParentSelector: "#basic-demo"
        // });
    });
});