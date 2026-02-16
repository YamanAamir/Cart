const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Base upload directory (outside src/, at project root level)
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');

// Ensure main uploads folder exists
if (!fs.existsSync(UPLOAD_ROOT)) {
  fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}

// ────────────────────────────────────────────────
//  Helper: create folder & return disk storage
// ────────────────────────────────────────────────
function createStorage(subfolder) {
  const folderPath = path.join(UPLOAD_ROOT, subfolder);

  // Create subfolder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folderPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });
}

// ────────────────────────────────────────────────
//  Global file filter (you can override per route if needed)
// ────────────────────────────────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed: jpg, jpeg, png, webp'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowed = /pdf|jpeg|jpg|png/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and images allowed for documents'), false);
  }
};

// ────────────────────────────────────────────────
//  Pre-configured upload instances
// ────────────────────────────────────────────────

const upload = {
  // ── Brands ── single logo image
  brandLogo: multer({
    storage: createStorage('brands'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: imageFilter,
  }).single('logo'),

  // ── Products ── multiple images (array field)
  productImages: multer({
    storage: createStorage('products'),
    limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB per file
    fileFilter: imageFilter,
  }).array('images', 4), // max 4 files

  // ── Products ── named individual image fields (alternative style)
  productNamedImages: multer({
    storage: createStorage('products'),
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: imageFilter,
  }).fields([
    { name: 'imageOne', maxCount: 1 },
    { name: 'imageTwo', maxCount: 1 },
    { name: 'imageThree', maxCount: 1 },
    { name: 'imageFour', maxCount: 1 },
  ]),

  // ── Dealer Registration ── resale certificate (PDF or image)
  resaleCertificate: multer({
    storage: createStorage('registrations'),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: documentFilter,
  }).single('resaleCertificate'),

  // ── Hero Section ── single hero image
  heroImage: multer({
    storage: createStorage('hero'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: imageFilter,
  }).single('image'),
};

module.exports = { upload };