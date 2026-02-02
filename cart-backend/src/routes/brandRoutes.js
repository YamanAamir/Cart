const express = require('express');
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  allBrand,
  getBrandBySlug
} = require('../controllers/brandController');
const { upload } = require("../middlewares/multer");

const { Shippo } = require("shippo");

const router = express.Router();

const shippo = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API_KEY, // use env variable
  shippoApiVersion: "2018-02-08",
});


// Brand routes
router.get('/brands', getBrands);
router.get('/all-brands', allBrand);
router.get('/brands/:id', getBrand);
router.post('/brands', upload.brandLogo, createBrand);
router.put('/brands/:id', upload.brandLogo, updateBrand);
router.post('/bulk-delete-brands', deleteBrand);
router.get('/brands/slug/:slug', getBrandBySlug);




router.post("/shipment", async (req, res) => {
  try {
    const { addressFrom, addressTo, addressReturn, parcels, shipmentDate, metadata } = req.body;

    // Validation
    if (!addressFrom || !addressTo || !addressReturn || !parcels || !parcels.length) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const shipment = await shippo.shipments.create({
      addressFrom,
      addressTo,
      addressReturn,
      parcels,
      shipmentDate: shipmentDate || new Date().toISOString(),
      metadata: metadata || "Test shipment",
    });

    res.json({ success: true, shipment });
  } catch (err) {
    console.error("Shippo shipment creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
