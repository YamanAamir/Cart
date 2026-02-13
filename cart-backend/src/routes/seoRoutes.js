const express = require("express");
const router = express.Router();
const { getPageSeo, updatePageSeo, getAllPageSeos } = require("../controllers/seoController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Public routes
router.get("/:pageName", getPageSeo);

// Admin routes
router.get("/", authenticateToken, getAllPageSeos);
router.post("/:pageName", authenticateToken, updatePageSeo);

module.exports = router;
