import Settings from '../models/Settings.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ websiteName: 'QuickBite' });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // Parse socialLinks from string if it came from FormData
    if (typeof updateData.socialLinks === 'string') {
      try {
        updateData.socialLinks = JSON.parse(updateData.socialLinks);
      } catch (error) {
        console.error('Failed to parse socialLinks JSON:', error);
      }
    }

    // Process uploaded logo and banner files
    if (req.files) {
      if (req.files.logoFile && req.files.logoFile[0]) {
        updateData.logo = `http://localhost:5000/uploads/${req.files.logoFile[0].filename}`;
      }
      if (req.files.bannerFile && req.files.bannerFile[0]) {
        updateData.banner = `http://localhost:5000/uploads/${req.files.bannerFile[0].filename}`;
      }
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updateData);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, updateData, { new: true });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};
