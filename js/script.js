// Navigation scroll effect
let lastScrollY = window.scrollY;
const nav = document.getElementById('navigation');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
});

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    
    mobileNav.classList.toggle('active');
    
    if (mobileNav.classList.contains('active')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    
    mobileNav.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Toast notification function
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Log form data (in production, send to server)
        console.log('Form submitted:', formData);
        
        // Show success message
        showToast('Message sent successfully! I will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card, .project-card, .cert-card, .venture-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Active navigation link highlight
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Removed dynamic JSON rendering. Using hardcoded content in index.html.

// Mobile: show a couple of projects, then a Show More button
(function setupMobileProjectToggle() {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;

    const SHOW_COUNT = 2; // show first two on mobile
    let moreWrapper = null;
    let button = null;

    const mq = window.matchMedia('(max-width: 767px)');

    function hideExtra() {
        const cards = Array.from(grid.querySelectorAll('.project-card'));
        const hidden = [];
        cards.forEach((card, idx) => {
            if (idx >= SHOW_COUNT) {
                card.style.display = 'none';
                hidden.push(card);
            } else {
                card.style.display = '';
            }
        });
        if (hidden.length > 0) {
            ensureButton();
        } else {
            removeButton();
        }
    }

    function showAll() {
        const cards = grid.querySelectorAll('.project-card');
        cards.forEach(card => card.style.display = '');
        removeButton();
    }

    function ensureButton() {
        if (!moreWrapper) {
            moreWrapper = document.createElement('div');
            moreWrapper.style.textAlign = 'center';
            moreWrapper.style.marginTop = '1rem';
            grid.parentElement.appendChild(moreWrapper);
        }
        if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-secondary';
            button.textContent = 'Show more';
            button.addEventListener('click', showAll);
            moreWrapper.appendChild(button);
        }
    }

    function removeButton() {
        if (button && button.parentElement) {
            button.removeEventListener('click', showAll);
            button.parentElement.removeChild(button);
        }
        button = null;
        if (moreWrapper && moreWrapper.parentElement) {
            moreWrapper.parentElement.removeChild(moreWrapper);
        }
        moreWrapper = null;
    }

    function apply(mobile) {
        if (mobile) {
            hideExtra();
        } else {
            showAll();
        }
    }

    // initial
    apply(mq.matches);
    // respond to viewport changes
    mq.addEventListener ? mq.addEventListener('change', e => apply(e.matches)) : mq.addListener(e => apply(e.matches));
})();

// Preloader: fade out on window load
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.classList.add('hidden');
    setTimeout(() => {
        if (preloader && preloader.parentElement) preloader.parentElement.removeChild(preloader);
    }, 600);
});

// Add a toggle button to each project to reveal/hide its description
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.project-card'));
    const mq = window.matchMedia('(max-width: 767px)');

    cards.forEach(card => {
        const desc = card.querySelector('.project-description');
        const buttonsArea = card.querySelector('.project-buttons') || card;
        if (!desc) return;

        // Create toggle button
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'project-toggle-btn';
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Hide description';

        // Initial collapsed state on mobile
        const setCollapsed = (collapsed) => {
            if (collapsed) {
                desc.classList.add('collapsed');
                btn.setAttribute('aria-expanded', 'false');
                btn.textContent = 'Show description';
            } else {
                desc.classList.remove('collapsed');
                btn.setAttribute('aria-expanded', 'true');
                btn.textContent = 'Hide description';
            }
        };

        // Append button into the buttons area (original placement)
        buttonsArea.appendChild(btn);

        // Toggle handler
        btn.addEventListener('click', () => {
            const isCollapsed = desc.classList.contains('collapsed');
            setCollapsed(!isCollapsed);
        });

        // Set initial: collapsed by default
        setCollapsed(true);
    });

    // Update when viewport changes
    const onChange = () => {
        // keep descriptions collapsed by default on viewport changes
        const cardsNow = Array.from(grid.querySelectorAll('.project-card'));
        cardsNow.forEach(card => {
            const desc = card.querySelector('.project-description');
            const btn = card.querySelector('.project-toggle-btn');
            if (!desc || !btn) return;
            setTimeout(() => { desc.classList.add('collapsed'); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Show description'; }, 0);
        });
    };
    mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
});

// Rotate hero subtitle phrases to make the hero more dynamic
document.addEventListener('DOMContentLoaded', () => {
    const items = Array.from(document.querySelectorAll('.hero-subtitle .subtitle-item'));
    if (!items.length) return;
    let idx = items.findIndex(i => i.classList.contains('active'));
    if (idx < 0) idx = 0;

    setInterval(() => {
        items[idx].classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
    }, 2600);
});
