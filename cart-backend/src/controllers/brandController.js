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
  const { name, imgAlt } = req.body;

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
        path: `/brand/${req.body.slug || slug}`,
        logo: logoPath,
        image_alt_name: imgAlt?.trim() || null,
        seoTitle: req.body.seoTitle || null,
        seoDescription: req.body.seoDescription || null,
        seoKeywords: req.body.seoKeywords || null,
        slug: req.body.slug || slug,
      },
    });

    res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// // Update brand
// const updateBrand = async (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   try {
//     const existingBrand = await prisma.brand.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!existingBrand) {
//       return res.status(404).json({ error: "Brand not found" });
//     }

//     let logoPath = existingBrand.logo;

//     if (req.file) {
//       // remove old file if exists
//       if (existingBrand.logo) {
//         const oldPath = path.join(__dirname, '..', '..', 'uploads', existingBrand.logo.replace('/uploads/', ''));
//         //               ^ adjust levels if multer.js is deeper
//         if (fs.existsSync(oldPath)) {
//           fs.unlinkSync(oldPath);
//         }
//       }

//       logoPath = `/uploads/brands/${req.file.filename}`;
//     }

//     const brand = await prisma.brand.update({
//       where: { id: parseInt(id) },
//       data: {
//         name,
//         logo: logoPath,
//         seoTitle: req.body.seoTitle !== undefined ? req.body.seoTitle : existingBrand.seoTitle,
//         seoDescription: req.body.seoDescription !== undefined ? req.body.seoDescription : existingBrand.seoDescription,
//         seoKeywords: req.body.seoKeywords !== undefined ? req.body.seoKeywords : existingBrand.seoKeywords,
//         slug: req.body.slug !== undefined ? req.body.slug : existingBrand.slug,
//         path: req.body.slug ? `/brand/${req.body.slug}` : existingBrand.path,
//       },
//     });

//     res.json(brand);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };
const updateBrand = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    imgAlt,               // ← added
    seoTitle,
    seoDescription,
    seoKeywords,
    slug
  } = req.body;

  try {
    const existingBrand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBrand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    let logoPath = existingBrand.logo;

    if (req.file) {
      // Remove old logo file if it exists
      if (existingBrand.logo) {
        // Be careful with path resolution – adjust '../..' depending on your folder structure
        const oldFileName = existingBrand.logo.split('/').pop(); // safer than replace
        const oldPath = path.join(__dirname, '..', '..', 'uploads', 'brands', oldFileName);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      logoPath = `/uploads/brands/${req.file.filename}`;
    }

    // If slug is provided → regenerate path; otherwise keep existing
    let finalPath = existingBrand.path;
    let finalSlug = existingBrand.slug;

    if (slug !== undefined) {
      finalSlug = slug.trim();
      finalPath = `/brand/${finalSlug}`;
    }

    // Optional: auto-regenerate slug from name if name changed and no slug provided
    // (uncomment if desired)
    /*
    if (name && name.trim() !== existingBrand.name && slug === undefined) {
      finalSlug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      finalPath = `/brand/${finalSlug}`;
    }
    */

    const updatedBrand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: {
        name: name ? name.trim() : existingBrand.name,
        logo: logoPath,
        image_alt_name: imgAlt !== undefined ? (imgAlt.trim() || null) : existingBrand.image_alt_name,  // ← added
        seoTitle: seoTitle !== undefined ? seoTitle : existingBrand.seoTitle,
        seoDescription: seoDescription !== undefined ? seoDescription : existingBrand.seoDescription,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : existingBrand.seoKeywords,
        slug: finalSlug,
        path: finalPath,
      },
    });

    return res.json(updatedBrand);
  } catch (error) {
    console.error("Error updating brand:", error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: "Conflict – brand with this name or slug already exists"
      });
    }

    return res.status(500).json({
      error: "Failed to update brand"
    });
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
        OR: [
          { slug: slug },
          { path: `/brand/${slug}` }
        ]
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