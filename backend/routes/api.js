const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const Settings = require('../models/Settings');

// Middleware to verify JWT
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// --- AUTH ROUTES ---

// Login
router.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// --- PROJECT ROUTES ---

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add project (Protected)
router.post('/projects', auth, async (req, res) => {
    try {
        const newProject = new Project(req.body);
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update project (Protected)
router.put('/projects/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete project (Protected)
router.delete('/projects/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// --- CONTACT ROUTES ---

// Submit contact form
router.post('/contacts', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        const contact = await newContact.save();
        res.json(contact);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get all messages (Protected)
router.get('/contacts', auth, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Mark message as read (Protected)
router.put('/contacts/:id/read', auth, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
        res.json(contact);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Delete message (Protected)
router.delete('/contacts/:id', auth, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Message deleted' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// --- SETTINGS ROUTES ---

// Get settings
router.get('/settings', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({ socialLinks: {} });
            await settings.save();
        }
        res.json(settings);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Update settings (Protected)
router.put('/settings', auth, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = new Settings();
        settings.contactEmail = req.body.contactEmail;
        settings.socialLinks = req.body.socialLinks;
        settings.updatedAt = Date.now();
        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
