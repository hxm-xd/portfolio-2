// Dashboard Logic - Connected to Firebase
import { 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc, 
    query, 
    orderBy,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        user: null,
        activeTab: 'overview',
        projects: [],
        messages: [],
        settings: {}
    };

    // DOM Elements
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    
    // Projects Elements
    const projectsContainer = document.getElementById('projects-list-container');
    const addProjectBtn = document.getElementById('add-project-btn');
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    
    // Messages Elements
    const messagesContainer = document.getElementById('messages-container');
    
    // Social Elements
    const socialForm = document.getElementById('social-links-form');

    // Initialize
    init();

    function init() {
        checkAuth();
        setupEventListeners();
    }

    // Auth Functions
    function checkAuth() {
        onAuthStateChanged(window.auth, (user) => {
            if (user) {
                state.user = user;
                showDashboard();
                loadDashboardData();
            } else {
                state.user = null;
                showLogin();
            }
        });
    }

    function showLogin() {
        loginView.classList.add('active');
        dashboardView.classList.remove('active');
    }

    function showDashboard() {
        loginView.classList.remove('active');
        dashboardView.classList.add('active');
    }

    async function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('username').value; // Firebase uses email
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button');

        try {
            await signInWithEmailAndPassword(window.auth, email, password);
            
            btn.innerHTML = '<i class="fas fa-check"></i> Success';
            btn.style.background = '#10b981';

            setTimeout(() => {
                btn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
                btn.style.background = '';
                e.target.reset();
            }, 800);
        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed: ' + err.message);
        }
    }

    async function handleLogout() {
        try {
            await signOut(window.auth);
        } catch (err) {
            console.error('Logout error:', err);
        }
    }

    // Data Loading
    async function loadDashboardData() {
        try {
            await Promise.all([
                loadProjects(),
                loadMessages(),
                loadSettings()
            ]);
            updateOverviewStats();
        } catch (err) {
            console.error('Error loading data:', err);
        }
    }

    async function loadProjects() {
        try {
            // Hardcoded projects for now
            state.projects = [
                {
                    id: "1",
                    title: "Warehouse Management Robot",
                    description: "Developed a low-cost warehouse inventory robot using Arduino Mega to assist with inventory tracking. Controlled via a custom mobile app, it features dual ultrasonic sensors for obstacle detection and an MPU9250 IMU for orientation tracking. Built with a modular design for future upgrades like SLAM and autonomous navigation, combining robotics and IoT concepts for practical warehouse automation.",
                    tags: ["Arduino", "TinkerCad", "Processing"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/projects/robot.jpg"
                },
                {
                    id: "2",
                    title: "AI and Academic Autonomy Study",
                    description: "Conducted a statistical study exploring whether undergraduates are losing independent thinking skills due to frequent AI use. Using surveys and applying descriptive, correlation, and regression analysis on responses from 30 NIBM undergraduates, we examined the relationship between AI usage, productivity, and academic confidence. Findings showed AI tools are widely used for coding and research, with a moderate trend suggesting frequent AI users may feel slightly less confident working independently, highlighting the need to balance AI support with critical thinking development in education.",
                    tags: ["Google Sheets", "Microsoft Excel", "Jamovi", "Firebase"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/projects/research.jpg"
                },
                {
                    id: "3",
                    title: "EduSync - Academic Management System",
                    description: "Developed a desktop application to help students manage attendance, GPA tracking, budget management, and task scheduling. Built with Java Swing, MySQL, and JDBC, implementing user login, CRUD operations, and personalized dashboards for effective academic task management.",
                    tags: ["Java", "Swing", "MySQL", "JDBC"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/projects/edusync.jpg"
                },
                {
                    id: "4",
                    title: "Smart Garbage Management System",
                    description: "Designed a smart waste management solution using Arduino Uno and ultrasonic sensors to monitor bin levels in real-time. The system alerts users when bins are full, optimizing waste collection routes and reducing overflow. Integrated with a simple display interface for status monitoring, demonstrating the application of IoT in sustainable urban living.",
                    tags: ["Arduino", "C++", "IoT"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/projects/iot.jpg"
                },
                {
                    id: "5",
                    title: "Vegetable & Fruit E-commerce Web Application",
                    description: "Developed a clean, user-friendly e-commerce platform for a vegetable and fruit store using HTML, CSS, JavaScript, Java (Spring Boot), and MVC architecture. Customers can browse categories, view product details, add items to cart, and place orders seamlessly. Focused on responsive design and intuitive navigation to enhance the online shopping experience, with a structured backend ensuring reliable product and order management.",
                    tags: ["SpringBoot", "Spring MVC", "Express.js", "HTML", "CSS", "JavaScript"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/placeholder.jpg"
                },
                {
                    id: "6",
                    title: "Quick Cart",
                    description: "Developed QuickCart, an all-in-one mobile app for purchasing goods and accessing services like transport, food delivery, and on-demand providers. Designed to simplify daily life by unifying diverse needs under a single platform. Built using Flutter, Firebase Authentication, Firestore, and Firebase Storage as part of the Diploma in Software Engineering final project at NIBM.",
                    tags: ["FlutterFlow (Flutter)", "Firebase"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/placeholder.jpg"
                },
                {
                    id: "7",
                    title: "Power BI Retail Sales Dashboard",
                    description: "Built an interactive dashboard in Power BI analyzing 51,000+ sales records across 25 attributes, focusing on sales trends, regional performance, product demand, and shipping efficiency. Managed data cleaning, transformation, and modeling to ensure accuracy, and used clear visual storytelling to present insights for better decision-making. This project strengthened my practical BI reporting and data analysis skills while delivering accessible, actionable business insights.",
                    tags: ["PowerBI", "Kaggle"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/placeholder.jpg"
                },
                {
                    id: "8",
                    title: "Landslide Detection and Monitoring System",
                    description: "Developing a real-time landslide detection system using IoT, robotics, and AI to enhance disaster preparedness in Sri Lanka. The system monitors soil moisture, ground vibrations, and rainfall, sending instant mobile alerts to residents and authorities when risk thresholds are reached. Using AI and machine learning to improve predictions, the project aligns with NBRO standards to ensure effective deployment. Aims to provide a scalable, cost-effective solution to reduce landslide risks.",
                    tags: ["ESP32", "Firebase", "Arduino IDE", "Blynk"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/placeholder.jpg"
                },
                {
                    id: "9",
                    title: "Billing and Inventory System",
                    description: "Developed a comprehensive billing and inventory management system to streamline product tracking, sales processing, and report generation. The system allows real-time stock updates, automated billing, and user-friendly dashboards for administrators and staff. Designed as part of the PDSA Project to integrate database management and efficient business process automation.",
                    tags: ["Java", "SpringBoot", "React.js", "MySQL", "Bootstrap"],
                    liveLink: "https://www.linkedin.com/in/hamood-thariq-979409289/details/projects/",
                    githubLink: "",
                    image: "assets/placeholder.jpg"
                },
                {
                    id: "10",
                    title: "Rotaract Club of Kandy Hill Capital (KHCP) Website",
                    description: "Designing and building a modern, responsive website for the Rotaract Club of Kandy Hill Capital. Features an animated hero with rotating background imagery, a sticky navbar with mobile hamburger menu, sections for About, Projects, and Contact, interactive project cards, and a contact form with real‑time validation and toast-style notifications. Includes smooth scrolling, scroll-to-top control, accessibility-focused focus states, and IntersectionObserver-powered reveal animations for performant UX.",
                    tags: ["HTML5", "CSS3", "JavaScript (Vanilla)", "Font Awesome", "Google Fonts (Inter)"],
                    liveLink: "https://rackhcp.vercel.app",
                    githubLink: "",
                    image: "assets/placeholder.jpg"
                }
            ];
            renderProjects();
        } catch (err) {
            console.error('Error loading projects:', err);
        }
    }

    async function loadMessages() {
        try {
            const q = query(collection(window.db, "messages"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            state.messages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderMessages();
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    }

    async function loadSettings() {
        try {
            const docRef = doc(window.db, "settings", "general");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                state.settings = docSnap.data();
                fillSocialForm();
            }
        } catch (err) {
            console.error('Error loading settings:', err);
        }
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

    // Render Functions
    function renderProjects() {
        if (!projectsContainer) return;
        projectsContainer.innerHTML = '';
        state.projects.forEach(project => {
            const el = document.createElement('div');
            el.className = 'project-admin-card';
            el.innerHTML = `
                <div class="project-admin-img">
                    <img src="../${escapeHtml(project.image) || 'assets/placeholder.jpg'}" alt="${escapeHtml(project.title)}">
                </div>
                <div class="project-admin-info">
                    <h4>${escapeHtml(project.title)}</h4>
                    <p>${escapeHtml(project.description).substring(0, 60)}...</p>
                    <div class="project-admin-tags">
                        ${project.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
                <div class="project-admin-actions">
                    <button class="btn-icon edit" data-id="${project.id}"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon delete" data-id="${project.id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            projectsContainer.appendChild(el);
        });

        // Add event listeners to buttons
        projectsContainer.querySelectorAll('.edit').forEach(btn => {
            btn.onclick = () => editProject(btn.dataset.id);
        });
        projectsContainer.querySelectorAll('.delete').forEach(btn => {
            btn.onclick = () => deleteProject(btn.dataset.id);
        });
    }

    function renderMessages() {
        if (!messagesContainer) return;
        messagesContainer.innerHTML = '';
        
        if (state.messages.length === 0) {
            messagesContainer.innerHTML = '<p class="no-data">No messages yet.</p>';
            return;
        }

        state.messages.forEach(msg => {
            const date = msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString() : 'N/A';
            const el = document.createElement('div');
            el.className = `message-card ${msg.read ? 'read' : 'unread'}`;
            el.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${escapeHtml(msg.name)}</span>
                    <span class="message-date">${date}</span>
                </div>
                <div class="message-email">${escapeHtml(msg.email)}</div>
                <div class="message-subject">Subject: ${escapeHtml(msg.subject)}</div>
                <div class="message-body">${escapeHtml(msg.message)}</div>
                <div class="message-actions">
                    ${!msg.read ? `<button class="btn-text mark-read" data-id="${msg.id}">Mark as Read</button>` : ''}
                    <button class="btn-text delete-msg" data-id="${msg.id}">Delete</button>
                </div>
            `;
            messagesContainer.appendChild(el);
        });

        messagesContainer.querySelectorAll('.mark-read').forEach(btn => {
            btn.onclick = () => markAsRead(btn.dataset.id);
        });
        messagesContainer.querySelectorAll('.delete-msg').forEach(btn => {
            btn.onclick = () => deleteMessage(btn.dataset.id);
        });
    }

    function fillSocialForm() {
        if (!socialForm) return;
        const s = state.settings.socialLinks || {};
        document.getElementById('social-github').value = s.github || '';
        document.getElementById('social-linkedin').value = s.linkedin || '';
        document.getElementById('social-twitter').value = s.twitter || '';
        document.getElementById('social-email').value = state.settings.contactEmail || '';
    }

    function updateOverviewStats() {
        const totalProjects = document.getElementById('stat-total-projects');
        const unreadMessages = document.getElementById('stat-unread-messages');
        
        if (totalProjects) totalProjects.textContent = state.projects.length;
        if (unreadMessages) unreadMessages.textContent = state.messages.filter(m => !m.read).length;
    }

    // Event Listeners
    function setupEventListeners() {
        loginForm.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                switchTab(tabId);
            });
        });

        // Project Modal
        addProjectBtn.addEventListener('click', () => openProjectModal());
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => projectModal.classList.remove('active'));
        });
        projectForm.addEventListener('submit', handleProjectSubmit);

        // Social Form
        socialForm.addEventListener('submit', handleSocialSubmit);

        // Close modal on outside click
        window.addEventListener('click', (e) => {
            if (e.target === projectModal) projectModal.classList.remove('active');
        });
    }

    function switchTab(tabId) {
        state.activeTab = tabId;
        navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-tab') === tabId);
        });
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabId}`);
        });
        pageTitle.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    }

    // Project Actions
    function openProjectModal(project = null) {
        const title = document.getElementById('modal-title');
        const form = document.getElementById('project-form');
        form.reset();
        
        if (project) {
            title.textContent = 'Edit Project';
            document.getElementById('project-id').value = project.id;
            document.getElementById('project-title').value = project.title;
            document.getElementById('project-description').value = project.description;
            document.getElementById('project-image').value = project.image;
            document.getElementById('project-tags').value = project.tags.join(', ');
            document.getElementById('project-link').value = project.liveLink || '';
            document.getElementById('project-github').value = project.githubLink || '';
        } else {
            title.textContent = 'Add New Project';
            document.getElementById('project-id').value = '';
        }
        
        projectModal.classList.add('active');
    }

    async function handleProjectSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('project-id').value;
        const projectData = {
            title: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value,
            image: document.getElementById('project-image').value,
            tags: document.getElementById('project-tags').value.split(',').map(t => t.trim()),
            liveLink: document.getElementById('project-link').value,
            githubLink: document.getElementById('project-github').value,
            createdAt: new Date()
        };

        try {
            if (id) {
                await updateDoc(doc(window.db, "projects", id), projectData);
            } else {
                await addDoc(collection(window.db, "projects"), projectData);
            }
            projectModal.classList.remove('active');
            loadProjects();
        } catch (err) {
            console.error('Error saving project:', err);
            alert('Error saving project');
        }
    }

    async function editProject(id) {
        const project = state.projects.find(p => p.id === id);
        if (project) openProjectModal(project);
    }

    async function deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteDoc(doc(window.db, "projects", id));
            loadProjects();
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    }

    // Message Actions
    async function markAsRead(id) {
        try {
            await updateDoc(doc(window.db, "messages", id), { read: true });
            loadMessages();
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    }

    async function deleteMessage(id) {
        if (!confirm('Delete this message?')) return;
        try {
            await deleteDoc(doc(window.db, "messages", id));
            loadMessages();
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    }

    // Social Actions
    async function handleSocialSubmit(e) {
        e.preventDefault();
        const settingsData = {
            contactEmail: document.getElementById('social-email').value,
            socialLinks: {
                github: document.getElementById('social-github').value,
                linkedin: document.getElementById('social-linkedin').value,
                twitter: document.getElementById('social-twitter').value
            },
            updatedAt: new Date()
        };

        try {
            await setDoc(doc(window.db, "settings", "general"), settingsData);
            alert('Settings updated successfully!');
            loadSettings();
        } catch (err) {
            console.error('Error updating settings:', err);
            alert('Error updating settings');
        }
    }
});
