// Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        isLoggedIn: localStorage.getItem('isAdminLoggedIn') === 'true',
        activeTab: 'overview',
        projects: [
            { id: 1, title: 'E-Commerce Platform', category: 'Full Stack', description: 'A modern e-commerce solution with React and Node.js' },
            { id: 2, title: 'Portfolio v1', category: 'Frontend', description: 'My first portfolio website using HTML/CSS' },
            { id: 3, title: 'Task Manager App', category: 'Mobile', description: 'Flutter based task management application' },
            { id: 4, title: 'Weather Dashboard', category: 'API Integration', description: 'Real-time weather data visualization' }
        ],
        skills: [
            'JavaScript', 'React', 'Node.js', 'Python', 'UI/UX', 'Git', 'MongoDB', 'SQL', 'Tailwind', 'TypeScript', 'Figma', 'Docker'
        ]
    };

    // DOM Elements
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    const projectsContainer = document.getElementById('projects-list-container');
    const skillsContainer = document.getElementById('skills-container');
    const addProjectBtn = document.getElementById('add-project-btn');
    const addSkillBtn = document.getElementById('add-skill-btn');

    // Initialize
    init();

    function init() {
        checkAuth();
        setupEventListeners();
        renderProjects();
        renderSkills();
    }

    // Auth Functions
    function checkAuth() {
        if (state.isLoggedIn) {
            showDashboard();
        } else {
            showLogin();
        }
    }

    function showLogin() {
        loginView.classList.add('active');
        dashboardView.classList.remove('active');
    }

    function showDashboard() {
        loginView.classList.remove('active');
        dashboardView.classList.add('active');
    }

    function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Mock validation
        if (username === 'admin' && password === 'admin123') { // Simple mock creds
            state.isLoggedIn = true;
            localStorage.setItem('isAdminLoggedIn', 'true');

            // Animation effect
            const btn = e.target.querySelector('button');
            btn.innerHTML = '<i class="fas fa-check"></i> Success';
            btn.style.background = '#10b981';

            setTimeout(() => {
                showDashboard();
                btn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
                btn.style.background = '';
                e.target.reset();
            }, 800);
        } else {
            alert('Invalid credentials! Try admin / admin123');
        }
    }

    function handleLogout() {
        state.isLoggedIn = false;
        localStorage.removeItem('isAdminLoggedIn');
        showLogin();
    }

    // Navigation Functions
    function setupEventListeners() {
        // Login
        loginForm.addEventListener('submit', handleLogin);
        logoutBtn.addEventListener('click', handleLogout);

        // Tabs
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                switchTab(tabId);
            });
        });

        // Actions
        addProjectBtn.addEventListener('click', () => {
            const title = prompt('Enter Project Title:');
            if (title) {
                const newProject = {
                    id: Date.now(),
                    title: title,
                    category: 'New Project',
                    description: 'Description pending...'
                };
                state.projects.unshift(newProject);
                renderProjects();
            }
        });

        addSkillBtn.addEventListener('click', () => {
            const skill = prompt('Enter new skill:');
            if (skill) {
                state.skills.push(skill);
                renderSkills();
            }
        });
    }

    function switchTab(tabId) {
        // Update State
        state.activeTab = tabId;

        // Update Nav UI
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update Content UI
        tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        // Update Header
        pageTitle.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
    }

    // Render Functions
    function renderProjects() {
        projectsContainer.innerHTML = '';
        state.projects.forEach(project => {
            const el = document.createElement('div');
            el.className = 'project-item';
            el.innerHTML = `
                <div class="project-info">
                    <h4>${project.title}</h4>
                    <p>${project.category} • ${project.description}</p>
                </div>
                <div class="project-actions">
                    <button class="btn-icon" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon delete" title="Delete" onclick="deleteProject(${project.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            projectsContainer.appendChild(el);
        });
    }

    function renderSkills() {
        skillsContainer.innerHTML = '';
        state.skills.forEach((skill, index) => {
            const el = document.createElement('div');
            el.className = 'skill-tag';
            el.innerHTML = `
                <span>${skill}</span>
                <i class="fas fa-times" onclick="removeSkill(${index})"></i>
            `;
            skillsContainer.appendChild(el);
        });
    }

    // Expose functions to window for inline onclicks (mock simplicity)
    window.deleteProject = function (id) {
        if (confirm('Delete this project?')) {
            state.projects = state.projects.filter(p => p.id !== id);
            renderProjects();
        }
    };

    window.removeSkill = function (index) {
        state.skills.splice(index, 1);
        renderSkills();
    };
});
