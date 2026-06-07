import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  websiteName: { type: String, required: true, default: 'QuickBite' },
  supportEmail: { type: String, default: 'support@quickbite.com' },
  supportPhone: { type: String, default: '+91 9999999999' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  socialLinks: {
    facebook: { type: String, default: '#' },
    twitter: { type: String, default: '#' },
    instagram: { type: String, default: '#' },
    youtube: { type: String, default: '#' },
    linkedin: { type: String, default: '#' }
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
