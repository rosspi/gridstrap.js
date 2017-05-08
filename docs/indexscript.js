
$(function(){ 
    for (var i = 0 ; i < 12 * 5; i++){
        $('#basic-grid').append('<div class="col-xs-4 col-sm-2 col-md-1 cell"><div class="inner"></div></div>'); 
    } 
    for (var i = 0 ; i < 12; i++){ 
        $('#noncontiguous-grid').append('<div class="col-xs-'+ Math.floor((Math.random() * 3 + 1)).toString()+' cell"><div class="inner"></div></div>');
    }
    for (var i = 0 ; i < 12 * 2; i++){ 
        $('#api-grid').append('<div class="col-xs-'+ Math.floor((Math.random() * 4 + 1)).toString()+' cell"><div class="inner"></div></div>');
    }

    $('#basic-grid').gridstrap({
         
    });

    $('a[href="#responsive-demo"]').on('shown.bs.tab', function(){ 
        $('iframe')[0].contentWindow.postMessage({} , '*'); 
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

    $('a[href="#api-demo"]').on('shown.bs.tab', function(){ 
        $('#api-grid').gridstrap({
            debug: true,
            visibleCellContainerParentSelector: '#api-demo' // inside a colum its position"relative."
            //visibleCellContainerParentSelector: "#basic-demo"
        });
    }); 

    $('#replace-mode').on('change', function(){
        var data = $('#api-grid').data('Gridstrap');
        data.updateOptions({
            swapMode: $(this).is(':checked')
        });
    });

    $('#rearrange-mode').on('change', function(){
        var data = $('#api-grid').data('Gridstrap');
        data.updateOptions({
            rearrangeWhileDragging: $(this).is(':checked')
        });
    });


    var interval = setInterval(function(){
        $('iframe').width(Math.random() * ($(window).width() / 1.2) + 100);
    }, 1000);

});