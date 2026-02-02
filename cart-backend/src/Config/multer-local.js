const multer = require('multer');

// TEMPORARY: disable disk uploads (Vercel-safe)
const upload = multer({
  storage: multer.memoryStorage()
});

module.exports = upload;
