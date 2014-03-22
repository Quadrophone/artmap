         /*global $:false */
        $(document).ready(function() {
            var isChrome = window.chrome;
            var isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1;
            var isIE = navigator.userAgent.toLowerCase().indexOf('msie/');
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
                            });
                        }
                        $('.artLink').click(function(e) {
                            e.preventDefault();
                            var smallImg = $(this).children('img').attr('data-zoom');
                            var largeImg = $(this).attr('href');
                            var zoomed = '<img id="zoomed" src="' + smallImg + '" data-zoom-image="' + largeImg + '">';
                            var imgTitle = $(this).children('img').attr('title');
                            var imgCaption = '<span class="img-title">' + imgTitle + '</span>';
                            $('.overlay, .zoom-instructions').show();
                            $('.image-zoom').show().append(zoomed).append(imgCaption);
                            $('#zoomed').bind("load", function() {
                                zoomHeight = $('#zoomed').height();
                                zoomWidth = $('#zoomed').width();
                                if ((isChrome) || (isSafari)) {
                                    $('div.image-zoom').css({
                                        height: (zoomHeight + 20),
                                        width: (zoomWidth + 20)
                                    });
                                } else {
                                    $('div.image-zoom').css({
                                        height: (zoomHeight),
                                        width: (zoomWidth)
                                    });
                                }
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
                    $(this).parent('.image-box').fadeOut(function() {
                        $(this).remove();
                        var boxNumber = $('.image-container > .image-box').size();
                        if (boxNumber === 0) {
                            $('.instructions').show();
                        }
                    });
                });
                $('a.close').click(function() {
                    $(this).parent('div').hide();
                });
                $('.image-zoom > a.close, .overlay').click(function() {
                    $('.image-zoom > img').remove();
                    $('.image-zoom > span').remove();
                    $('.overlay, .image-zoom, .zoom-instructions').hide();
                    $('.zoomContainer').remove();
                });
            });
        });
