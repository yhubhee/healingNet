(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 3
            }
        }
    });


    // Team carousel
    $(".team-carousel, .related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 45,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            992: {
                items: 2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: true,
        loop: true,
    });

})(jQuery);

// FOR ApPPOINTMENT PAGE
// document.addEventListener("DOMContentLoaded", function () {
//     // Save the default content from the main area on page load
//     var defaultMainContent = document.querySelector(".main-content").innerHTML;

//     document.querySelectorAll(".load-content").forEach(function (link) {
//         link.addEventListener("click", function (event) {
//             event.preventDefault();
//             let url = this.getAttribute("data-url");

//             if (url === "/dashboard") {
//                 // Restore the original main content
//                 document.querySelector(".main-content").innerHTML = defaultMainContent;
//             } else {
//                 // Otherwise, fetch the new content via AJAX
//                 fetch(url)
//                     .then(response => response.text())
//                     .then(html => {
//                         document.querySelector(".main-content").innerHTML = html;
//                     })
//                     .catch(error => console.error("Error loading page:", error));
//             }
//         });
//     });
// });

// Custom Script for Toggle Border on Navbar Brand and Sidebar Dropdown Toggle 

const navbarToggler = document.querySelector('.navbar-toggler');
const navbarBrand = document.querySelector('.navbar-brand');

navbarToggler.addEventListener('click', function () {
    // Delay slightly to allow the aria-expanded attribute to update
    setTimeout(() => {
        if (navbarToggler.getAttribute('aria-expanded') === 'true') {
            navbarBrand.classList.add('border-bottom');
        } else {
            navbarBrand.classList.remove('border-bottom');
        }
    }, 100);
});

document.getElementById('sidebarToggle').addEventListener('click', function () {
    var sidebarContent = document.getElementById('sidebarContent');
    if (sidebarContent.classList.contains('d-none')) {
        sidebarContent.classList.remove('d-none');
    } else {
        sidebarContent.classList.add('d-none');
    }
});


