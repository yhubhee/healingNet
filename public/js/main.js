
// Make the navbar fixed on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('fixed-top');
    } else {
        navbar.classList.remove('fixed-top');
    }
});

// Slideshsow

const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
let currentIndex = 0;

function showSlide(index) {
    const slidesContainer = document.querySelector('.slides');
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    navDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function autoSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
}

navDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        currentIndex = i;
        showSlide(currentIndex);
    });
});

// Start slideshow
let slideInterval = setInterval(autoSlide, 5000);

// Pause on hover
document.querySelector('.hero-slideshow').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.hero-slideshow').addEventListener('mouseleave', () => {
    slideInterval = setInterval(autoSlide, 5000);
});
