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

    // Printed Portfolio Slideshow
    const pSlides = document.querySelectorAll('.p-slide');
    const pBtnPrev = document.getElementById('p-slider-prev');
    const pBtnNext = document.getElementById('p-slider-next');

    if (pSlides.length > 0) {
        let currentPSlideIndex = 0;
        let pSlideInterval;

        const goToPSlide = (index) => {
            pSlides[currentPSlideIndex].classList.remove('p-slide-active');
            pSlides[currentPSlideIndex].style.opacity = '0';
            
            currentPSlideIndex = index;

            if (currentPSlideIndex < 0) currentPSlideIndex = pSlides.length - 1;
            if (currentPSlideIndex >= pSlides.length) currentPSlideIndex = 0;

            pSlides[currentPSlideIndex].classList.add('p-slide-active');
            pSlides[currentPSlideIndex].style.opacity = '1';
        };

        const nextPSlide = () => goToPSlide(currentPSlideIndex + 1);
        const prevPSlide = () => goToPSlide(currentPSlideIndex - 1);

        const startPSlider = () => {
            clearInterval(pSlideInterval);
            pSlideInterval = setInterval(nextPSlide, 4000); // 4 seconds
        };

        if (pBtnNext) {
            pBtnNext.addEventListener('click', (e) => {
                e.preventDefault();
                nextPSlide();
                startPSlider();
            });
        }

        if (pBtnPrev) {
            pBtnPrev.addEventListener('click', (e) => {
                e.preventDefault();
                prevPSlide();
                startPSlider();
            });
        }

        startPSlider(); // Start the loop immediately
    }
    // Mobile Menu Toggle
    const logo = document.querySelector('.logo');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (logo && mobileNav) {
        logo.addEventListener('click', (e) => {
            // Check for mobile width
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                e.preventDefault();
                mobileNav.classList.toggle('active');
            }
        });

        // Close menu when clicking any mobile link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!logo.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
            }
        });
    }

    // Projects Filtering Logic
    const filterProjects = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const typology = urlParams.get('type');
        const projectLinks = document.querySelectorAll('.project-link');
        const projectsGrid = document.querySelector('.projects-grid');
        
        if (!projectLinks.length) return;

        // Apply filtering logic
        let visibleCount = 0;
        projectLinks.forEach(link => {
            const projectType = link.getAttribute('data-type');
            
            if (!typology || typology === 'all' || projectType === typology) {
                link.classList.remove('hidden');
                link.classList.add('visible');
                
                // Add staggered delay for the "Norm" feel
                link.style.animationDelay = `${visibleCount * 0.1}s`;
                visibleCount++;

                // Ensure article inside is visible for observer
                const article = link.querySelector('article');
                if (article) article.classList.add('visible');
            } else {
                link.classList.remove('visible');
                link.classList.add('hidden');
                link.style.animationDelay = '0s';
            }
        });

        // Small delay before removing the filtering state to let elements align
        // and allow the CSS transition to play out smoothly
        setTimeout(() => {
            document.documentElement.removeAttribute('data-filtering');
            if (projectsGrid) projectsGrid.style.opacity = '1';
        }, 50);
    };

    // Run filter on load
    filterProjects();

    // Re-run filter when URL changes (for navigation within the same page)
    window.addEventListener('popstate', () => {
        // When using popstate (back/forward), we might want to re-apply the filtering state
        // for a split second to avoid flicker if the browser doesn't handle the DOM swap instantly
        document.documentElement.setAttribute('data-filtering', 'true');
        filterProjects();
    });
    
    // Add logic to handle typology clicks without full page reloads if on projects page
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('projects') && window.location.pathname.includes('projects')) {
                const targetType = new URLSearchParams(href.split('?')[1]).get('type');
                const currentUrl = new URL(window.location);
                currentUrl.searchParams.set('type', targetType || 'all');
                window.history.pushState({}, '', currentUrl);
                filterProjects();
                
                // Close mobile menu if open
                if (mobileNav) mobileNav.classList.remove('active');
            }
        });
    });
});
