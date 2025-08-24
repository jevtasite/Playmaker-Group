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

//Smooth scroll

$(document).ready(function() {
    const $navLinks = $('a.nav-item.nav-link[href^="#"]'); 
    const $sections = $('div[id]'); 
    const $backToTop = $('.back-to-top');

    $navLinks.on('click', function(e) {
        const $target = $($(this).attr('href'));
        if($target.length) {
            e.preventDefault();
            $('html, body').stop().animate({
                scrollTop: $target.offset().top
            }, 600, 'swing');
        }
    });

    $(window).on('scroll', function() {
        const scrollPos = $(window).scrollTop();

        let activeSet = false;
        $sections.each(function() {
            const top = $(this).offset().top - 100; 
            const bottom = top + $(this).outerHeight();
            const id = $(this).attr('id');
            const $link = $(`a.nav-item.nav-link[href="#${id}"]`);

            if(scrollPos >= top && scrollPos < bottom) {
                $navLinks.removeClass('active');
                $link.addClass('active');
                activeSet = true;
            }
        });

        if(!activeSet) {
            $navLinks.removeClass('active');
            $('a.nav-item.nav-link[href="#home"]').addClass('active');
        }

        // Back-to-top
        if($backToTop.length) {
            if(scrollPos > 100) $backToTop.fadeIn('fast');
            else $backToTop.fadeOut('fast');
        }
    });

    // Back-to-top click
    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').stop().animate({ scrollTop: 0 }, 600, 'swing');
    });
});

// Gallery Modal 

document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
    const modal = new bootstrap.Modal(document.getElementById('galleryModal'));
    const modalImage = document.getElementById('modalImage');
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');

    let currentIndex = 0;

    function showImage(index) {
        currentIndex = index;
        modalImage.src = galleryImages[currentIndex].src;
    }

    // Open modal on click
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            showImage(index);
            modal.show();
        });
    });

    // Previous image
    prevBtn.addEventListener('click', function() {
        let newIndex = currentIndex - 1;
        if(newIndex < 0) newIndex = galleryImages.length - 1;
        showImage(newIndex);
    });

    // Next image
    nextBtn.addEventListener('click', function() {
        let newIndex = currentIndex + 1;
        if(newIndex >= galleryImages.length) newIndex = 0;
        showImage(newIndex);
    });

    // Navigate with arrow keys
    document.addEventListener('keydown', function(e) {
        if(modal._isShown) {
            if(e.key === "ArrowLeft") prevBtn.click();
            if(e.key === "ArrowRight") nextBtn.click();
        }
    });
});
