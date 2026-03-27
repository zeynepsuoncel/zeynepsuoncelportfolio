// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Hide/Show navbar based on scroll direction (optional, but adds to the minimal feel)
    // Basic implementation:
    /*
    const currentScrollPos = window.scrollY;
    if (prevScrollpos > currentScrollPos) {
        navbar.style.transform = "translateY(0)";
    } else {
        navbar.style.transform = "translateY(-100%)";
    }
    prevScrollpos = currentScrollPos;
    */
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all elements to animate
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // Hero Background Slideshow
    const slides = document.querySelectorAll('.slide');
    const heroLink = document.getElementById('hero-link');
    const btnPrev = document.getElementById('slider-prev');
    const btnNext = document.getElementById('slider-next');

    if (slides.length > 0 && heroLink) {
        // Determine if we are on the English version
        const isEnglish = window.location.pathname.includes('_en.html');

        let projectLinks = [
            'marciano.html',
            'ruya.html',
            'podere.html',
            'bereket.html',
            'ronchamp.html'
        ];

        if (isEnglish) {
            projectLinks = projectLinks.map(link => link.replace('.html', '_en.html'));
        }

        let currentSlideIndex = 0;
        let slideInterval;

        const goToSlide = (index) => {
            slides[currentSlideIndex].classList.remove('slide-active');
            currentSlideIndex = index;

            if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
            if (currentSlideIndex >= slides.length) currentSlideIndex = 0;

            slides[currentSlideIndex].classList.add('slide-active');
            heroLink.href = projectLinks[currentSlideIndex];
        };

        const nextSlide = () => goToSlide(currentSlideIndex + 1);
        const prevSlide = () => goToSlide(currentSlideIndex - 1);

        const startSlider = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // 5 seconds
        };

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.preventDefault(); // Stop from clicking the background project link
                nextSlide();
                startSlider();
            });
        }

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                startSlider();
            });
        }

        startSlider(); // Start the loop immediately
    }
});
