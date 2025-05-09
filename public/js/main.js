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

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keyup', e => {
    let currentValue = e.target.value.toLowerCase();
    let doctorCards = document.querySelectorAll('.doctor-card');

    doctorCards.forEach(card => {
        let docName = card.querySelector('h3')?.textContent.toLowerCase().trim() || '';
        let specialty = card.querySelector('h6 .doc-specialty')?.textContent.toLowerCase().trim() || '';
        let isVisible = docName.includes(currentValue) || specialty.includes(currentValue);

        if (isVisible) {
            card.classList.remove('d-none');
            card.classList.add('d-flex');
            // Disable AOS for newly visible cards
            if (!card.dataset.aosApplied) {
                card.removeAttribute('data-aos');
                card.removeAttribute('data-aos-delay');
                card.dataset.aosApplied = true; // Mark as processed
            }
        } else {
            card.classList.remove('d-flex');
            card.classList.add('d-none');
        }
    });
});

let loadMoreBtn = document.querySelector('.load-more');
let doctorCards = document.querySelectorAll('.doctor-card');

let visibleCards = 4; // Number of cards to show initially

doctorCards.forEach((card, index) => {
    if (index < visibleCards) {
        card.style.display = 'inline-block';
    } else {
        card.style.display = 'none';
    }
});

let cardsToShow = 4; 

loadMoreBtn.onclick = () => {
    if (visibleCards < doctorCards.length) {
        // Calculate the new number of visible cards
        let newVisibleCards = Math.min(visibleCards + cardsToShow, doctorCards.length);

        // Show the next set of cards
        for (let i = visibleCards; i < newVisibleCards; i++) {
            doctorCards[i].style.display = 'inline-block';
        }

        // Update the visibleCards counter
        visibleCards = newVisibleCards;
    }
};
