         /*global $:false */
         $(document).ready(function() {
            var isChrome = window.chrome;
            var isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
            var isIE = navigator.userAgent.toLowerCase().indexOf('msie/');
            var delay = (function() {
                var timer = 0;
                return function(callback, ms) {
                  clearTimeout(timer);
                  timer = setTimeout(callback, ms);
              };
          })();


          $('img[usemap]').rwdImageMaps();
          function capitaliseFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        $('area').click(function() {
            $('.instructions').fadeOut();
            $('.overlay, .spinner').show();
            var place = $(this).attr('name');
            place = capitaliseFirstLetter(place);
            var API = 'https://www.rijksmuseum.nl/api/en/collection?key=pmgmbU1o&type=painting&place=' + place + '&showImage=true';
            $.getJSON(API, {
                format: 'json'
            })
            .success(function(data) {
                $('.overlay, .spinner').hide();
                if ($('.' + place).length) {
                    alert(place + ' is already open!');
                } else {
                    $('<div class="image-box ' + place + '"><h3 class="place">' + place + '</h3><a class="close">X</a>').appendTo('.image-container');
                    $.each(data.artObjects, function(index, artObject) {
                        if (artObject.webImage !== null) {
                            $('<a class="artLink" href="' + artObject.webImage.url + '"><img class="artObject" title = "' + artObject.longTitle + '" src="' + artObject.webImage.url.replace("s0", "s256") + '" data-zoom="' + artObject.webImage.url.replace("s0", "s650") + '"></a>').appendTo('.' + place);
                        }
                        $('</div>').appendTo('.image-container');
                        $('.image-container').sortable();
                        $('.image-box').perfectScrollbar({
                            wheelSpeed: 35,
                            suppressScrollX: true
                        });
                        delay(function() {
                            $('.image-box').masonry({
                            isFitWidth: true,
                            itemSelector: '.artLink',
                        });
                      }, 250)
                    });
     }
     $('a.close').click(function() {
        $(this).parent('.image-box').fadeOut(function() {
            $(this).remove();
            var boxNumber = $('.image-container > .image-box').size();
            if (boxNumber === 0) {
                $('.instructions').show();
            }
        });
    });
     $('.artLink').click(function(e) {
        e.preventDefault();
        var smallImg = $(this).children('img').attr('data-zoom');
        var largeImg = $(this).attr('href');
        var zoomed = '<img id="zoomed" src="' + smallImg + '" data-zoom-image="' + largeImg + '">';
        var imgTitle = $(this).children('img').attr('title');
        var imgCaption = '<div class="img-title"><span class="img-title">' + imgTitle + '</span></div>';
        $('.overlay, .zoom-instructions').show();
        $('.image-zoom').show().append(zoomed, imgCaption);
        $('#zoomed').bind("load", function() {
            zoomHeight = $('#zoomed').height();
            zoomWidth = $('#zoomed').width();
            $('div.image-zoom').css({
                height: (zoomHeight + 20),
                width: (zoomWidth + 20)
            });
            $("#zoomed").elevateZoom({
                zoomType: "lens",
                lensShape: "round",
                lensSize: 200,
                scrollZoom: true
            });
            $('#zoomed').mouseenter(function() {
                $('.zoomLens').css('display', 'block:!important');
            });
        });
    });
     });

         $('a.close').click(function() {
            $(this).parent('div').hide();
        });
         $('.image-zoom > a.close, .overlay').click(function() {
            $('.image-zoom > img').remove();
            $('.image-zoom > div').remove();
            $('.overlay, .image-zoom, .zoom-instructions').hide();
            $('.zoomContainer').remove();
        });
     });
     });
