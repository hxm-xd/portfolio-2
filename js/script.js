import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    getDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Record start time for preloader
const siteStartTime = Date.now();

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
window.toggleMobileMenu = function() {
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
};

// Close mobile menu
window.closeMobileMenu = function() {
    const mobileNav = document.getElementById('mobileNav');
    const menuIcon = document.getElementById('menuIcon');
    
    mobileNav.classList.remove('active');
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
};

// Smooth scroll to top
window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

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
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject') ? document.getElementById('subject').value : 'Portfolio Contact',
            message: document.getElementById('message').value,
            read: false,
            createdAt: new Date()
        };
        
        try {
            await addDoc(collection(window.db, "messages"), formData);
            showToast('Message sent successfully! I will get back to you soon.');
            contactForm.reset();
        } catch (err) {
            console.error('Contact error:', err);
            showToast('Error sending message. Please try again later.');
        }
    });
}

// Set current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

    // Fetch projects if on projects page
    if (document.getElementById('projects-container')) {
        fetchProjects();
    }

    // Fetch settings for social links
    fetchSettings();
});

async function fetchSettings() {
    try {
        const docRef = doc(window.db, "settings", "general");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            updateSocialLinks(docSnap.data());
        }
    } catch (err) {
        console.error('Error fetching settings:', err);
    }
}

function updateSocialLinks(settings) {
    const { socialLinks, contactEmail } = settings;
    
    // Update GitHub links
    document.querySelectorAll('a[aria-label="GitHub"]').forEach(a => {
        if (socialLinks.github) a.href = socialLinks.github;
    });
    
    // Update LinkedIn links
    document.querySelectorAll('a[aria-label="LinkedIn"]').forEach(a => {
        if (socialLinks.linkedin) a.href = socialLinks.linkedin;
    });
    
    // Update Twitter links (if any)
    document.querySelectorAll('a[aria-label="Twitter"]').forEach(a => {
        if (socialLinks.twitter) a.href = socialLinks.twitter;
    });
    
    // Update Email links
    document.querySelectorAll('a[aria-label="Email"]').forEach(a => {
        if (contactEmail) a.href = `mailto:${contactEmail}`;
    });
}

// Security: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Hardcoded Projects Data
const HARDCODED_PROJECTS = [
    {
        id: "1",
        title: "Warehouse Management Robot",
        description: "Developed a low-cost warehouse inventory robot using Arduino Mega to assist with inventory tracking. Controlled via a custom mobile app, it features dual ultrasonic sensors for obstacle detection and an MPU9250 IMU for orientation tracking. Built with a modular design for future upgrades like SLAM and autonomous navigation, combining robotics and IoT concepts for practical warehouse automation.",
        tags: ["Arduino", "TinkerCad", "Processing"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "2",
        title: "AI and Academic Autonomy Study",
        description: "Conducted a statistical study exploring whether undergraduates are losing independent thinking skills due to frequent AI use. Using surveys and applying descriptive, correlation, and regression analysis on responses from 30 NIBM undergraduates, we examined the relationship between AI usage, productivity, and academic confidence. Findings showed AI tools are widely used for coding and research, with a moderate trend suggesting frequent AI users may feel slightly less confident working independently, highlighting the need to balance AI support with critical thinking development in education.",
        tags: ["Google Sheets", "Microsoft Excel", "Jamovi", "Firebase"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "3",
        title: "EduSync - Academic Management System",
        description: "Developed a desktop application to help students manage attendance, GPA tracking, budget management, and task scheduling. Built with Java Swing, MySQL, and JDBC, implementing user login, CRUD operations, and personalized dashboards for effective academic task management.",
        tags: ["Java", "Swing", "MySQL", "JDBC"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "4",
        title: "Smart Garbage Management System",
        description: "Designed a smart waste management solution using Arduino Uno and ultrasonic sensors to monitor bin levels in real-time. The system alerts users when bins are full, optimizing waste collection routes and reducing overflow. Integrated with a simple display interface for status monitoring, demonstrating the application of IoT in sustainable urban living.",
        tags: ["Arduino", "C++", "IoT"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "5",
        title: "Vegetable & Fruit E-commerce Web Application",
        description: "Developed a clean, user-friendly e-commerce platform for a vegetable and fruit store using HTML, CSS, JavaScript, Java (Spring Boot), and MVC architecture. Customers can browse categories, view product details, add items to cart, and place orders seamlessly. Focused on responsive design and intuitive navigation to enhance the online shopping experience, with a structured backend ensuring reliable product and order management.",
        tags: ["SpringBoot", "Spring MVC", "Express.js", "HTML", "CSS", "JavaScript"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "6",
        title: "Quick Cart",
        description: "Developed QuickCart, an all-in-one mobile app for purchasing goods and accessing services like transport, food delivery, and on-demand providers. Designed to simplify daily life by unifying diverse needs under a single platform. Built using Flutter, Firebase Authentication, Firestore, and Firebase Storage as part of the Diploma in Software Engineering final project at NIBM.",
        tags: ["FlutterFlow (Flutter)", "Firebase"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "7",
        title: "Power BI Retail Sales Dashboard",
        description: "Built an interactive dashboard in Power BI analyzing 51,000+ sales records across 25 attributes, focusing on sales trends, regional performance, product demand, and shipping efficiency. Managed data cleaning, transformation, and modeling to ensure accuracy, and used clear visual storytelling to present insights for better decision-making. This project strengthened my practical BI reporting and data analysis skills while delivering accessible, actionable business insights.",
        tags: ["PowerBI", "Kaggle"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "8",
        title: "Landslide Detection and Monitoring System",
        description: "Developing a real-time landslide detection system using IoT, robotics, and AI to enhance disaster preparedness in Sri Lanka. The system monitors soil moisture, ground vibrations, and rainfall, sending instant mobile alerts to residents and authorities when risk thresholds are reached. Using AI and machine learning to improve predictions, the project aligns with NBRO standards to ensure effective deployment. Aims to provide a scalable, cost-effective solution to reduce landslide risks.",
        tags: ["ESP32", "Firebase", "Arduino IDE", "Blynk"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "9",
        title: "Billing and Inventory System",
        description: "Developed a comprehensive billing and inventory management system to streamline product tracking, sales processing, and report generation. The system allows real-time stock updates, automated billing, and user-friendly dashboards for administrators and staff. Designed as part of the PDSA Project to integrate database management and efficient business process automation.",
        tags: ["Java", "SpringBoot", "React.js", "MySQL", "Bootstrap"],
        liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
        githubLink: ""
    },
    {
        id: "10",
        title: "Rotaract Club of Kandy Hill Capital (KHCP) Website",
        description: "Designing and building a modern, responsive website for the Rotaract Club of Kandy Hill Capital. Features an animated hero with rotating background imagery, a sticky navbar with mobile hamburger menu, sections for About, Projects, and Contact, interactive project cards, and a contact form with real‑time validation and toast-style notifications. Includes smooth scrolling, scroll-to-top control, accessibility-focused focus states, and IntersectionObserver-powered reveal animations for performant UX.",
        tags: ["HTML5", "CSS3", "JavaScript (Vanilla)", "Font Awesome", "Google Fonts (Inter)"],
        liveLink: "https://rackhcp.vercel.app",
        githubLink: ""
    }
];

async function fetchProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        // Use hardcoded projects instead of Firebase
        const projects = HARDCODED_PROJECTS;
        
        if (projects.length === 0) {
            container.innerHTML = '<p class="no-data">No projects found.</p>';
            return;
        }

        container.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.style.setProperty('--gradient', 'linear-gradient(135deg, hsl(150 100% 50%), hsl(180 100% 50%))');
            
            card.innerHTML = `
                <div class="project-header">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <div class="project-buttons">
                    ${project.liveLink ? `<a href="${escapeHtml(project.liveLink)}" target="_blank" rel="noopener" class="btn-link">View Details <i class="fas fa-external-link-alt"></i></a>` : ''}
                    ${project.githubLink ? `<a href="${escapeHtml(project.githubLink)}" target="_blank" rel="noopener" class="btn-link">GitHub <i class="fab fa-github"></i></a>` : ''}
                </div>
            `;
            container.appendChild(card);
            
            // Observe new card
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(card);
        });
    } catch (err) {
        console.error('Error fetching projects:', err);
        container.innerHTML = '<p class="error">Failed to load projects. Please try again later.</p>';
    }
}

/*
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
*/

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
    
    const minDuration = 2000; // 2 seconds minimum
    const elapsedTime = Date.now() - siteStartTime;
    const remainingTime = Math.max(0, minDuration - elapsedTime);
    
    // Ensure all images are loaded (extra precaution)
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
        });
    });

    Promise.all(imagePromises).then(() => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            
            // Wait for the CSS transition (0.8s) to finish
            setTimeout(() => {
                if (preloader && preloader.parentElement) {
                    preloader.parentElement.removeChild(preloader);
                }
                // Dispatch event to start hero animations
                window.dispatchEvent(new CustomEvent('preloaderFinished'));
                
                // Show navigation
                const nav = document.getElementById('navigation');
                if (nav) nav.classList.add('visible');

                // Show footer
                const footer = document.querySelector('.footer');
                if (footer) footer.classList.add('visible');
            }, 800);
        }, remainingTime);
    });
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

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 2.5, // Slower duration for smoother feel
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 0.8, // Reduce sensitivity slightly
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

