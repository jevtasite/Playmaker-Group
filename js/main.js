(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar 
   /* $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    }); */
    
    
    // Back to top button
$(document).ready(function () {
    $('.back-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600, 'swing');
    });
});

    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            992:{
                items:2
            }
        }
    });


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
})(jQuery);

// Added 

// Scroll effect 
/*window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {  
        navbar.classList.add('shrink');
    } else {
        navbar.classList.remove('shrink');
    }
}); */

// Smooth scrolling for all anchor links using jQuery
$(document).ready(function() {
    $('a[href^="#"]').on('click', function(e) {
        var target = this.hash;
        var $target = $(target);
        if ($target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $target.offset().top - 0 
            }, 800, 'swing');
        }
    });
});

//Navbar collapse animation
const navbarCollapse = document.querySelector('#navbarCollapse');

navbarCollapse.addEventListener('show.bs.collapse', () => {
    navbarCollapse.style.transition = 'height 0.5s ease';
});

navbarCollapse.addEventListener('hide.bs.collapse', () => {
    navbarCollapse.style.transition = 'height 0.5s ease';
});

//Sticky & Shrink navbar

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');

    if (window.innerWidth >= 992) { // Desktop
        if (window.scrollY > 45) {
            navbar.classList.add('sticky-top', 'shadow-sm', 'shrink');
        } else {
            navbar.classList.remove('sticky-top', 'shadow-sm', 'shrink');
        }
    } else { // Mobile
        navbar.classList.remove('sticky-top', 'shadow-sm', 'shrink'); 
    }
});

window.addEventListener('resize', function() {
    const navbar = document.querySelector('.navbar');
    if (window.innerWidth < 992) {
        navbar.classList.remove('sticky-top', 'shadow-sm', 'shrink');
    }
});

