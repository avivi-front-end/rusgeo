'use strict';
if (!window.console)
    window.console = {};
if (!window.console.memory)
    window.console.memory = function() {};
if (!window.console.debug)
    window.console.debug = function() {};
if (!window.console.error)
    window.console.error = function() {};
if (!window.console.info)
    window.console.info = function() {};
if (!window.console.log)
    window.console.log = function() {};

// sticky footer
//-----------------------------------------------------------------------------
if (!Modernizr.flexbox) {
    (function() {
        var $pageWrapper = $('#page-wrapper'),
            $pageBody = $('#page-body'),
            noFlexboxStickyFooter = function() {
                $pageBody.height('auto');
                if ($pageBody.height() + $('#header').outerHeight() + $('#footer').outerHeight() < $(window).height()) {
                    $pageBody.height($(window).height() - $('#header').outerHeight() - $('#footer').outerHeight());
                } else {
                    $pageWrapper.height('auto');
                }
            };
        $(window).on('load resize', noFlexboxStickyFooter);
    })();
}
if (ieDetector.ieVersion == 10 || ieDetector.ieVersion == 11) {
    (function() {
        var $pageWrapper = $('#page-wrapper'),
            $pageBody = $('#page-body'),
            ieFlexboxFix = function() {
                if ($pageBody.addClass('flex-none').height() + $('#header').outerHeight() + $('#footer').outerHeight() < $(window).height()) {
                    $pageWrapper.height($(window).height());
                    $pageBody.removeClass('flex-none');
                } else {
                    $pageWrapper.height('auto');
                }
            };
        ieFlexboxFix();
        $(window).on('load resize', ieFlexboxFix);
    })();
}

$(function() {

    // placeholder
    //-----------------------------------------------------------------------------
    $('input[placeholder], textarea[placeholder]').placeholder();
});

var sliderItem = (function() {
    var sliderTop = $('.product-cart__image-top');
    var sliderBottom = $('.product-cart__slider-navigation');
    var navLink = $('.product-cart__slider-navigation-link');

    sliderTop.slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: '.product-cart__image-mobile-btn--prev',
        nextArrow: '.product-cart__image-mobile-btn--next',
        responsive: [{
            breakpoint: 767,
            settings: {

                infinite: true
            }
        }]
        // asNavFor: sliderBottom
    })

    sliderBottom.slick({
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 5,
        prevArrow: '.product-cart__navigantion-btn--prev',
        nextArrow: '.product-cart__navigantion-btn--next'
    })
    $('.product-cart__navigantion-btn--prev').hide()

    sliderBottom.on('afterChange', function(slick, currentSlide) {
        var count = 0;
        $(currentSlide.$slides).each(function() {
            if ($(this).hasClass('slick-active')) {
                count++
            }
        })

        if (currentSlide.currentSlide == 0) {
            $('.product-cart__navigantion-btn--next').show()
            $('.product-cart__navigantion-btn--prev').hide()
            return false
        }
        if ((currentSlide.slideCount - currentSlide.currentSlide) <= count) {
            $('.product-cart__navigantion-btn--next').hide()
            $('.product-cart__navigantion-btn--prev').show()
        } else if ((currentSlide.slideCount - currentSlide.currentSlide) > count) {
            $('.product-cart__navigantion-btn--next').show()
            $('.product-cart__navigantion-btn--prev').show()
        }

    })

    sliderTop.on('afterChange', function(slick, currentSlide) {
        navLink.removeClass('active')
        $('.product-cart__slider-navigation-link[data-slick-index=' + currentSlide.currentSlide + ']').addClass('active')

    })

    navLink.on('click', function(e) {
        e.preventDefault();

        var index = $(this).attr('data-slick-index');
        navLink.removeClass('active');
        $(this).addClass('active')
        sliderTop.slick('slickGoTo', index)
    })

    // $('.js-show-drop ').on('click', function(e) {
    //     e.preventDefault();
    //     $(this).next('.catalog-main__sort-dropdowm').slideToggle(200)
    //     $(this).toggleClass('active')
    // })

})();

var accessoriesSlider = (function() {

    var slider = $('.js-accessories');
    var prev = $('.js-accessories-prev');
    var next = $('.js-accessories-next');

    var topLink = $('.product-accessories__list-link');
    var slideArray = [];
    var mobileSelect = $('.js-mobile-select')
    var count = $('.js-accessories-count');

    slider.on('init', function(slick) {
        prev.hide();

        count.find('.js-current').html('1');

        count.find('.js-all').html(slider.find('.product-accessories__slider-item').length);
    });

    slider.slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '.js-accessories-prev',
        nextArrow: '.js-accessories-next',

        responsive: [{
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]

    });

    slider.find('.product-accessories__slider-item').each(function() {
        var tempObj = {}
        tempObj = {
            id: $(this).attr('data-category'),
            html: $(this).html()
        }
        slideArray.push(tempObj)
    })


    slider.on('afterChange', function(slick, currentSlide) {
        checkArrows(currentSlide)
        updateCount(currentSlide);
    });

    topLink.on('click', function(e) {
        e.preventDefault();
        topLink.removeClass('active')
        $(this).addClass('active')
        var catTarget = $(this).attr('href');
        changeAccessories(catTarget)
    })

    mobileSelect.on('change', function() {
        var catTarget = $(this).val();
        changeAccessories(catTarget)
    });

    function updateCount(currentSlide) {
        count.find('.js-current').html(currentSlide.currentSlide + 1);
        count.find('.js-all').html(currentSlide.slideCount);
    }

    function changeAccessories(catTarget) {
        slider.slick('removeSlide', null, null, true);
        if (catTarget == 'all') {
            slideArray.forEach(function(value) {
                slider.slick('slickAdd', '<div class="product-accessories__slider-item">' + value.html + '</div>');
            })
            checkArrows(slider[0].slick)
            updateCount(slider[0].slick)
            return false
        }
        slider.slick('slickGoTo', 0);

        slideArray.forEach(function(value) {
            if (value.id == catTarget) {
                slider.slick('slickAdd', '<div class="product-accessories__slider-item">' + value.html + '</div>');
            }
        })
        checkArrows(slider[0].slick)
        updateCount(slider[0].slick)

    }

    function checkArrows(currentSlide) {

        var count = 0;
        var minLength = 0;
        $(currentSlide.$slides).each(function() {
            if ($(this).hasClass('slick-active')) {
                count++
            }
        })

        if ($(window).outerWidth() < 767) {
            minLength = 1
        } else {
            minLength = 4
        }

        if (currentSlide.slideCount <= minLength) {
            next.hide()
            prev.hide()
            return false
        }

        if (currentSlide.currentSlide == 0) {
            next.show()
            prev.hide()
            return false
        }
        if ((currentSlide.slideCount - currentSlide.currentSlide) <= count) {
            next.hide()
            prev.show()
        } else if ((currentSlide.slideCount - currentSlide.currentSlide) > count) {
            next.show()
            prev.show()
        }

    }
})();

var recentSlider = (function() {
    var slider = $('.js-recent');
    var prev = $('.js-recent-prev');
    var next = $('.js-recent-next');
    var remove = $('.js-remove-recent');
    var count = $('.js-recent-count');

    slider.on('init', function(slick) {
        prev.hide()
        count.find('.js-current').html('1');
        count.find('.js-all').html(slider.find('.product-accessories__slider-item').length);
    });

    slider.slick({
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: '.js-recent-prev',
        nextArrow: '.js-recent-next',
        responsive: [{
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        }, {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }]
    });

    slider.on('afterChange', function(slick, currentSlide) {
        checkArrows(currentSlide)
        updateCount(currentSlide)
    });

    function updateCount(currentSlide) {

        count.find('.js-current').html(currentSlide.currentSlide + 1);
        count.find('.js-all').html(currentSlide.slideCount);
    }

    function checkArrows(currentSlide) {

        var count = 0;
        var minLength = 0;
        $(currentSlide.$slides).each(function() {
            if ($(this).hasClass('slick-active')) {
                count++
            }
        })

        if ($(window).outerWidth() < 767) {
            minLength = 1
        } else {
            minLength = 4
        }

        if (currentSlide.slideCount <= minLength) {
            next.hide()
            prev.hide()
            return false
        }

        if (currentSlide.currentSlide == 0) {
            next.show()
            prev.hide()
            return false
        }
        if ((currentSlide.slideCount - currentSlide.currentSlide) <= count) {
            next.hide()
            prev.show()
        } else if ((currentSlide.slideCount - currentSlide.currentSlide) > count) {
            next.show()
            prev.show()
        }

    }
    remove.on('click', function(e) {
        e.preventDefault();
        var target = $(this).closest('.product-accessories__slider-item').attr('data-slick-index')
        slider.slick('slickRemove', target);
        checkArrows(slider[0].slick)
        updateCount(slider[0].slick)
    });
})()

var tabs = (function() {
    var mobile = $('.product-tabs__mobile-tabs');
    var desktop = $('.js-tab-link');
    var option = $('.js-option');

    option.on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        // console.log($(this).attr('href'));

        $('html, body').animate({
            scrollTop: $('.product-tabs').offset().top
        }, 500);
        setTimeout(function() {
            $('.js-tab-link[href="' + $this.attr() + '"]').addClass('active')
        }, 10)
    })

    mobile.on('click', function(e) {
        e.preventDefault();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('.product-tabs__item').slideUp(200)
            return false
        }

        mobile.removeClass('active');
        $(this).addClass('active')
        $('.product-tabs__item').slideUp(200)
        $(this).next('.product-tabs__item').slideDown(200);
    })

    desktop.on('click', function(e) {
        e.preventDefault();
        desktop.removeClass('active')
        $(this).addClass('active')
        var tabTarget = $(this).attr('href');
        $('.product-tabs__item').hide();

        $(tabTarget).show()
    })
})()

var reviewList = (function() {
    var reviewItems = $('.product-review-list__item')
    var showBtn = $('.product-review-list__show');
    if ($(window).outerWidth() < 767) {
        $(window).on('load resize', function() {
            reviewItems.each(function() {
                $(this).find('.js-text').attr('style', '')
                $(this).find('.js-text').next('.product-review-list__show').hide()
                if ($(this).find('.js-text').outerHeight() >= 275) {
                    $(this).find('.js-text').attr('date-height', $(this).find('.js-text').outerHeight())
                    $(this).find('.js-text').css({
                        'height': 275,
                        'overflow': 'hidden',
                        'transition': '.2s'
                    })
                    $(this).find('.js-text').next('.product-review-list__show').css('display', 'inline')
                }
            })
        })

        showBtn.on('click', function(e) {
            e.preventDefault();
            var targetText = $(this).closest('.product-review-list__item').find('.js-text');
            if ($(this).hasClass('active')) {
                targetText.css({
                    'height': 275,
                    'overflow': 'hidden',
                    'transition': '.2s'
                })
                $(this).html('Показать всё')
            } else {
                targetText.css({
                    'height': targetText.attr('date-height')
                })
                $(this).html('Скрыть')
            }

            $(this).toggleClass('active')

        })
    }
})()

var config = (function() {
    var link = $('.js-show-detail-config');

    link.on('click', function(e) {
        var detail = $(this).closest('.product-config__info-left').find('.product-config__detail');
        e.preventDefault();

        if ($(this).hasClass('active')) {
            detail.slideUp(200)
            $(this).html('Подробнее')
        } else {
            detail.slideDown(200)
            $(this).html('Скрыть')
        }

        $(this).toggleClass('active');
    })
})();

var writeReview = (function() {
    var link = $('.js-add-review');
    var reviewWrap = $('.product-review__form-row');
    var close = $('.js-close-review');

    link.on('click', function(e) {
        e.preventDefault();
        reviewWrap.slideDown(200);

        $(this).hide()
    })

    close.on('click', function(e) {
        e.preventDefault();
        reviewWrap.slideUp(200);
        link.show()
    })
})();

function getRow(n) {
    return (Math.floor(n/4))+1;
}

var catalog = (function() {
    $('.catalog-main__item').on('mouseover', function() {
        var height = $(this).find('.catalog-main__item-title').height() > 13 ?
            $(this).find('.catalog-main__item-title').height() :
            0;
        var itemRow = getRow($(this).index());

        var targetHeight = $('.catalog-main__item').eq((itemRow - 1)*4).outerHeight();

        for (var i = ((itemRow - 1)*4);i <= ((itemRow*4)-1);i++){
            $('.catalog-main__item').eq(i).css({
                'height' : targetHeight
            })
        }

        $(this).css({
            'height': 'auto',
            'margin-bottom': '-'+height+'px'
        })
        // console.log(itemRow);
        $(this).find('.catalog-main__info-wrapper').css({
            'padding-top': 24 + height
        });
    });

    $('.catalog-main__item').on('mouseout', function() {
        $('.catalog-main__item').attr('style', '')
        $(this).find('.catalog-main__info-wrapper').attr('style', '')
    });
})();
