const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    contactEmail: { type: String },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', SettingsSchema);
