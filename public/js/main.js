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


document.addEventListener('DOMContentLoaded', function () {
    const message = document.querySelectorAll('.show');
    if (message) {
        setTimeout(() => {
            message.forEach(message => {
                message.style.display = 'none';
            });
        }, 5000); // Hide after 5 seconds
    }
});

const div1 = document.getElementById('div1');
const div2 = document.getElementById('div2');
const div3 = document.getElementById('div3');
const div4 = document.getElementById('div4');
const div5 = document.getElementById('div5');

const div1_con = document.getElementById('div1_con');
const div2_con = document.getElementById('div2_con');
const div3_con = document.getElementById('div3_con');
const div4_con = document.getElementById('div4_con');
const div5_con = document.getElementById('div5_con');

// Array of all tabs and their corresponding content sections
const tabs = [
    div1 && div1_con ? { tab: div1, content: div1_con } : null,
    div2 && div2_con ? { tab: div2, content: div2_con } : null,
    div3 && div3_con ? { tab: div3, content: div3_con } : null,
    div4 && div4_con ? { tab: div4, content: div4_con } : null,
    div5 && div5_con ? { tab: div5, content: div5_con } : null,
].filter(Boolean); // Remove null entries

// Function to reset all tabs to inactive style
function resetTabStyles() {
    tabs.forEach(({ tab }) => {
        tab.classList.remove('btn-dark');
        tab.classList.add('btn-color-mine');
    });
}

// Function to hide all content sections
function hideAllContent() {
    tabs.forEach(({ content }) => {
        content.style.display = 'none';
    });
}

// Add click event listeners to each tab
tabs.forEach(({ tab, content }) => {
    // console.log(tab, content)
    tab.addEventListener('click', () => {
        // Hide all content sections
        hideAllContent();
        // Show the clicked tab's content
        content.style.display = 'flex';

        // Reset all tab styles and set the clicked tab to active
        resetTabStyles();
        tab.classList.remove('btn-color-mine');
        tab.classList.add('btn-dark');
    });
});