AOS.init();
$(".slick-slider").slick({
    slidesToShow: 1,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1200,
    dots: false,
    arrows: true,
    responsive: [{
        breakpoint: 1024,
        settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
        }
    }]
});
$('.aboutproduct-tabs a').click(function(event) {
    var apTabsElem = $('.aboutproduct-tabs');
    apTabsElem.find('li').removeClass('active-tab');
    apTabsElem.find('a').removeClass('active');
    var navlinkElem = $(this);
    var navlinkList = navlinkElem.parent();
    navlinkElem.addClass('active');
    navlinkList.addClass('active-tab');
    navlinkList.prevAll().addClass('active-tab');
});

function showSection(x){
    document.getElementById(x).style.display = 'block';
}

function showBottomSections() {
    document.getElementById('apps').style.display = 'block';
    document.getElementById('faqs').style.display = 'block';
    document.getElementById('review').style.display = 'block';
    document.getElementById('contact-us').style.display = 'block';
}
$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll <= 50) {
        $('.navbar-header').removeClass("header-sticky");
    } else {
        $('.navbar-header').addClass('header-sticky');
    }
});
$('.nav-item').click(function() {
    $('.navbar div').removeClass('show');
});

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

var $slider = $('.slick-slider');
if ($slider.length) {
    var currentSlide;
    var slidesCount;
    var currentSlideNo = document.getElementById('current-slide');
    var lastSlideNo = document.getElementById('last-slide');
    var updateSliderCounter = function(slick, currentIndex) {
        currentSlide = slick.slickCurrentSlide() + 1;
        slidesCount = slick.slideCount;
        lastSlideNo.innerHTML = slidesCount;
    };
    $slider.on('afterChange', function(event, slick, currentSlide) {
        updateSliderCounter(slick, currentSlide);
        currentSlideNo.innerHTML = currentSlide + 1;
    });
    $slider.slick();
}