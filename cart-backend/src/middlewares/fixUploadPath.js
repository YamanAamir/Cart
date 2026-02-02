const path = require('path');

module.exports = (req, res, next) => {
  if (!req.file && !req.files) return next();

  const baseUrl = 'https://api.qistmarket.pk/uploads';

  if (req.file) {
    const filename = req.file.filename || path.basename(req.file.path);
    req.file.path = `${baseUrl}/${filename}`;
    req.file.filename = null;
  }

  if (req.files && Array.isArray(req.files)) {
    req.files = req.files.map(file => {
      const filename = file.filename || path.basename(file.path);
      return { ...file, path: `${baseUrl}/${filename}`, filename: null };
    });
  }

  next();
};