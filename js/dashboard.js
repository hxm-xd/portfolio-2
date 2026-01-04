// Dashboard Logic - Connected to Backend API
const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    // State Management
    const state = {
        token: localStorage.getItem('adminToken'),
        isLoggedIn: !!localStorage.getItem('adminToken'),
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
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Messages Elements
    const messagesContainer = document.getElementById('messages-container');
    
    // Social Elements
    const socialForm = document.getElementById('social-links-form');

    // Initialize
    init();

    function init() {
        checkAuth();
        setupEventListeners();
        if (state.isLoggedIn) {
            loadDashboardData();
        }
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

    async function handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                state.token = data.token;
                state.isLoggedIn = true;
                localStorage.setItem('adminToken', data.token);

                btn.innerHTML = '<i class="fas fa-check"></i> Success';
                btn.style.background = '#10b981';

                setTimeout(() => {
                    showDashboard();
                    loadDashboardData();
                    btn.innerHTML = '<span>Login</span><i class="fas fa-arrow-right"></i>';
                    btn.style.background = '';
                    e.target.reset();
                }, 800);
            } else {
                alert(data.msg || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Server error. Is the backend running?');
        }
    }

    function handleLogout() {
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('adminToken');
        showLogin();
    }

    // API Helpers
    async function fetchWithAuth(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': state.token,
            ...options.headers
        };

        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
        
        if (response.status === 401) {
            handleLogout();
            throw new Error('Session expired');
        }
        
        return response;
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
            const res = await fetch(`${API_URL}/projects`);
            state.projects = await res.json();
            renderProjects();
        } catch (err) {
            console.error('Error loading projects:', err);
        }
    }

    async function loadMessages() {
        try {
            const res = await fetchWithAuth('/contacts');
            state.messages = await res.json();
            renderMessages();
        } catch (err) {
            console.error('Error loading messages:', err);
        }
    }

    async function loadSettings() {
        try {
            const res = await fetch(`${API_URL}/settings`);
            state.settings = await res.json();
            fillSocialForm();
        } catch (err) {
            console.error('Error loading settings:', err);
        }
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
                    <img src="../${project.image || 'assets/placeholder.jpg'}" alt="${project.title}">
                </div>
                <div class="project-admin-info">
                    <h4>${project.title}</h4>
                    <p>${project.description.substring(0, 60)}...</p>
                    <div class="project-admin-tags">
                        ${project.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="project-admin-actions">
                    <button class="btn-icon edit" onclick="editProject('${project._id}')"><i class="fas fa-pen"></i></button>
                    <button class="btn-icon delete" onclick="deleteProject('${project._id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            projectsContainer.appendChild(el);
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
            const date = new Date(msg.createdAt).toLocaleDateString();
            const el = document.createElement('div');
            el.className = `message-card ${msg.read ? 'read' : 'unread'}`;
            el.innerHTML = `
                <div class="message-header">
                    <span class="message-sender">${msg.name}</span>
                    <span class="message-date">${date}</span>
                </div>
                <div class="message-email">${msg.email}</div>
                <div class="message-subject">Subject: ${msg.subject}</div>
                <div class="message-body">${msg.message}</div>
                <div class="message-actions">
                    ${!msg.read ? `<button onclick="markAsRead('${msg._id}')" class="btn-text">Mark as Read</button>` : ''}
                    <button onclick="deleteMessage('${msg._id}')" class="btn-text delete">Delete</button>
                </div>
            `;
            messagesContainer.appendChild(el);
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
        closeModalBtn.addEventListener('click', () => projectModal.classList.remove('active'));
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
            document.getElementById('project-id').value = project._id;
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
            githubLink: document.getElementById('project-github').value
        };

        try {
            const method = id ? 'PUT' : 'POST';
            const endpoint = id ? `/projects/${id}` : '/projects';
            
            const res = await fetchWithAuth(endpoint, {
                method,
                body: JSON.stringify(projectData)
            });

            if (res.ok) {
                projectModal.classList.remove('active');
                loadProjects();
            } else {
                const data = await res.json();
                alert(data.msg || 'Error saving project');
            }
        } catch (err) {
            console.error('Error saving project:', err);
        }
    }

    window.editProject = function(id) {
        const project = state.projects.find(p => p._id === id);
        if (project) openProjectModal(project);
    };

    window.deleteProject = async function(id) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetchWithAuth(`/projects/${id}`, { method: 'DELETE' });
            if (res.ok) loadProjects();
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    };

    // Message Actions
    window.markAsRead = async function(id) {
        try {
            const res = await fetchWithAuth(`/contacts/${id}/read`, { method: 'PUT' });
            if (res.ok) loadMessages();
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    };

    window.deleteMessage = async function(id) {
        if (!confirm('Delete this message?')) return;
        try {
            const res = await fetchWithAuth(`/contacts/${id}`, { method: 'DELETE' });
            if (res.ok) loadMessages();
        } catch (err) {
            console.error('Error deleting message:', err);
        }
    };

    // Social Actions
    async function handleSocialSubmit(e) {
        e.preventDefault();
        const settingsData = {
            contactEmail: document.getElementById('social-email').value,
            socialLinks: {
                github: document.getElementById('social-github').value,
                linkedin: document.getElementById('social-linkedin').value,
                twitter: document.getElementById('social-twitter').value
            }
        };

        try {
            const res = await fetchWithAuth('/settings', {
                method: 'PUT',
                body: JSON.stringify(settingsData)
            });

            if (res.ok) {
                alert('Settings updated successfully!');
                loadSettings();
            } else {
                alert('Error updating settings');
            }
        } catch (err) {
            console.error('Error updating settings:', err);
        }
    }
});
