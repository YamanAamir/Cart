const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs");

const prisma = new PrismaClient();

// Get all brands (paginated)
const getBrands = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    sort = "name",
    order = "asc",
  } = req.query;

  const skip = (page - 1) * limit;
  const take = Number(limit);

  try {
    const brands = await prisma.brand.findMany({
      include: {
        models: true,
        products: true,
      },
      orderBy: {
        [sort]: order,
      },
      take,
      skip,
    });

    const totalItems = await prisma.brand.count();

    res.json({
      data: brands,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single brand
const getBrand = async (req, res) => {
  const { id } = req.params;

  try {
    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        models: true,
        products: {
          include: { productType: true },
        },
      },
    });

    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allBrand = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      include: { models: true },
    });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create brand
const createBrand = async (req, res) => {
  const { name } = req.body;

  try {
    let logoPath = null;
  if (req.file) {
    logoPath = `/uploads/brands/${req.file.filename}`;
  }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const pathField = `/brand/${slug}`;

    const brand = await prisma.brand.create({
    data: {
      name,
      path: `/brand/${name}`,
      logo: logoPath,
    },
  });

    res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Update brand
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const existingBrand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    let logoPath = existingBrand.logo;

  if (req.file) {
    // remove old file if exists
    if (existingBrand.logo) {
      const oldPath = path.join(__dirname, '..', '..', 'uploads', existingBrand.logo.replace('/uploads/', ''));
      //               ^ adjust levels if multer.js is deeper
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    logoPath = `/uploads/brands/${req.file.filename}`;
  }

    const brand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: {
        name,
        logo: logoPath,
      },
    });

    res.json(brand);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Delete brand(s)
const deleteBrand = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Please provide an array of IDs" });
  }

  try {
    const brands = await prisma.brand.findMany({
      where: { id: { in: ids } },
      select: { id: true, logo: true },
    });

    // Delete physical files
    for (const brand of brands) {
    if (brand.logo) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', brand.logo.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

    const deleted = await prisma.brand.deleteMany({
      where: { id: { in: ids } },
    });

    res.json({ message: `${deleted.count} brand(s) deleted successfully` });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBrandBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const brand = await prisma.brand.findFirst({
      where: {
        path: `/brand/${slug}`,
      },
      include: {
        models: true,
      },
    });

    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBrands,
  getBrand,
  allBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandBySlug,
};