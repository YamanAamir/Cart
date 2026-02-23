const { PrismaClient } = require("@prisma/client");
const { put, del } = require("@vercel/blob");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const fishbowl = require('../services/fishbowlService');
// ==================== CREATE PRODUCT ====================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      regularPrice,
      salePrice,
      stock = 0,
      color,
      brandId,
      modelId,
      typeId,
      weightLb,
      lengthIn,
      widthIn,
      heightIn,
      description,
      seoTitle,
      seoDescription,
      seoKeywords,
      slug,
      imgAltOne,
      imgAltTwo,
      imgAltThree,
      imgAltFour,
    } = req.body;

    if (!name || !regularPrice || !brandId || !modelId || !typeId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const parsedRegularPrice = parseFloat(regularPrice);
    const parsedSalePrice = salePrice ? parseFloat(salePrice) : null;
    const parsedStock = parseInt(stock, 10);
    const parsedBrandId = parseInt(brandId, 10);
    const parsedModelId = parseInt(modelId, 10);
    const parsedTypeId = parseInt(typeId, 10);
    const parsedWeightLb = weightLb ? parseFloat(weightLb) : null;
    const parsedLengthIn = lengthIn ? parseFloat(lengthIn) : null;
    const parsedWidthIn = widthIn ? parseFloat(widthIn) : null;
    const parsedHeightIn = heightIn ? parseFloat(heightIn) : null;

    // Validation
    if (isNaN(parsedRegularPrice) || parsedRegularPrice <= 0) {
      return res.status(400).json({ message: "regularPrice must be > 0" });
    }

    const imageFields = { imageOne: null, imageTwo: null, imageThree: null, imageFour: null };
    const uploadedFiles = req.files || [];
    if (uploadedFiles.length > 4) {
      return res.status(400).json({ message: "Max 4 images allowed" });
    }

    uploadedFiles.forEach((file, index) => {
      if (index < 4) {
        const field = `image${['One','Two','Three','Four'][index]}`;
        imageFields[field] = `/uploads/products/${file.filename}`;
      }
    });

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        regularPrice: parsedRegularPrice,
        salePrice: parsedSalePrice,
        stock: parsedStock,
        color: color?.trim() || null,
        brandId: parsedBrandId,
        modelId: parsedModelId,
        typeId: parsedTypeId,
        weightLb: parsedWeightLb,
        lengthIn: parsedLengthIn,
        widthIn: parsedWidthIn,
        heightIn: parsedHeightIn,
        description: description?.trim() || null,
        seoTitle, seoDescription, seoKeywords, slug,
        ...imageFields,
        imgAltOne, imgAltTwo, imgAltThree, imgAltFour,
      },
      include: { brand: { select: { name: true } }, model: { select: { name: true } }, productType: { select: { name: true } } },
    });

   // ─────────────────────────────────────────────
// Fishbowl Sync - Start
let csvData = ''; // declare outside try for catch access

try {
  const partNumber = `PROD-${product.id}`;

  // Description ko 100% safe banao (blank nahi jaayega)
  let descriptionValue = product.description?.trim();
  if (!descriptionValue || descriptionValue.length < 1) {
    descriptionValue = `Product: ${product.name.trim()} - Imported from e-commerce`;
  }
  console.log('[Fishbowl Debug] Final description:', descriptionValue);

  // Special characters clean (Fishbowl strict parser ke liye)
  descriptionValue = descriptionValue
    .replace(/"/g, '""')           // escape double quotes
    .replace(/\r?\n|\r/g, ' ')     // line breaks ko space mein
    .replace(/,/g, ' ')            // comma ko space mein (CSV break na ho)
    .trim();

  // Exact Fishbowl import format (tumhare documents se verified)
  const csvHeader = "PartNumber,PartDescription,PartType,UOM,Price,Weight,Active,ManagePart,POItemType";

  // Row values (sab string mein aur quote wrapped)
  const rowValues = [
    partNumber,
    descriptionValue,
    "Inventory",                  // Required: Inventory, Non-Inventory, Service, etc.
    "ea",                       // Required UOM
    Number(product.salePrice || product.regularPrice || 0).toFixed(2),
    Number(product.weightLb || 1).toFixed(2),
    "Y",                         
    "Y",
    "Purchase"                      
  ];

  // CSV row banao with proper quoting
  const csvRow = rowValues.map(value => {
    const str = String(value);
    return `"${str.replace(/"/g, '""')}"`;
  }).join(',');

  csvData = csvHeader + "\r\n" + csvRow;

  // Debug print (exact CSV jo ja raha hai)
  console.log('[Fishbowl Debug] Final CSV (line by line):');
  console.log(csvHeader);
  console.log(csvRow);
  console.log('[Fishbowl Debug] Full CSV length:', csvData.length);
  console.log('[Fishbowl Debug] Full CSV content:');
  console.log(csvData);

  // Import call
  const fbResponse = await fishbowl.importPart(csvData);

  console.log('Fishbowl import response:', JSON.stringify(fbResponse, null, 2));

  // Save to Prisma
  await prisma.product.update({
    where: { id: product.id },
    data: { fishbowlPartNumber: partNumber },
  });

  console.log(`Fishbowl Part synced successfully: ${partNumber}`);
} catch (fbErr) {
  console.error('Fishbowl product sync failed details:', {
    message: fbErr.message,
    status: fbErr.response?.status,
    fullError: fbErr.response?.data,
    csvSent: csvData || 'CSV not defined'
  });
}

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};
// ==================== BULK CREATE ===================


// ==================== UPDATE PRODUCT ====================
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name, regularPrice, salePrice, stock, color, brandId, modelId, typeId,
    weightLb, lengthIn, widthIn, heightIn, description, seoTitle,
    seoDescription, seoKeywords, slug, imgAltOne, imgAltTwo, imgAltThree, imgAltFour,
  } = req.body;

  try {
    const productId = parseInt(id);
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) return res.status(404).json({ message: "Product not found" });

    const currentImages = {
      imageOne: existing.imageOne,
      imageTwo: existing.imageTwo,
      imageThree: existing.imageThree,
      imageFour: existing.imageFour,
    };

    const imageFields = ["imageOne", "imageTwo", "imageThree", "imageFour"];
    for (const field of imageFields) {
      const file = req.files?.[field]?.[0];
      const remove = req.body[`remove_${field}`] === 'true';

      if (remove && currentImages[field]) {
        const oldPath = path.join(process.cwd(), "uploads", "products", path.basename(currentImages[field]));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        currentImages[field] = null;
      } else if (file) {
        if (currentImages[field]) {
          const oldPath = path.join(process.cwd(), "uploads", "products", path.basename(currentImages[field]));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        currentImages[field] = `/uploads/products/${file.filename}`;
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (regularPrice !== undefined) updateData.regularPrice = parseFloat(regularPrice);
    if (salePrice !== undefined) updateData.salePrice = salePrice ? parseFloat(salePrice) : null;
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (color !== undefined) updateData.color = color?.trim() || null;
    if (brandId !== undefined) updateData.brandId = parseInt(brandId, 10);
    if (modelId !== undefined) updateData.modelId = parseInt(modelId, 10);
    if (typeId !== undefined) updateData.typeId = parseInt(typeId, 10);
    if (weightLb !== undefined) updateData.weightLb = weightLb ? parseFloat(weightLb) : null;
    if (lengthIn !== undefined) updateData.lengthIn = lengthIn ? parseFloat(lengthIn) : null;
    if (widthIn !== undefined) updateData.widthIn = widthIn ? parseFloat(widthIn) : null;
    if (heightIn !== undefined) updateData.heightIn = heightIn ? parseFloat(heightIn) : null;
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle?.trim() || null;
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription?.trim() || null;
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords?.trim() || null;
    if (slug !== undefined) updateData.slug = slug?.trim() || null;
    if (imgAltOne !== undefined) updateData.imgAltOne = imgAltOne?.trim() || null;
    if (imgAltTwo !== undefined) updateData.imgAltTwo = imgAltTwo?.trim() || null;
    if (imgAltThree !== undefined) updateData.imgAltThree = imgAltThree?.trim() || null;
    if (imgAltFour !== undefined) updateData.imgAltFour = imgAltFour?.trim() || null;

    Object.assign(updateData, currentImages);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: { brand: { select: { name: true } }, model: { select: { name: true } }, productType: { select: { name: true } } },
    });

    // ─── Fishbowl Sync on Update ───
    if (updatedProduct.fishbowlPartNumber) {
      try {
        const csvHeader = "PartNumber,Description,UOM,Price,WeightLb,Type,Active,ManagePart";
        const csvRow = `"${updatedProduct.fishbowlPartNumber}","${updatedProduct.name} - ${updatedProduct.description || ''}","Each",${updatedProduct.salePrice || updatedProduct.regularPrice},${updatedProduct.weightLb || 1},"Inventory","Y","Y"`;
        const csvData = `${csvHeader}\n${csvRow}`;

        await fishbowl.importPart(csvData);
        console.log(`Fishbowl Part updated: ${updatedProduct.fishbowlPartNumber}`);
      } catch (fbErr) {
        console.error('Fishbowl update sync failed:', fbErr);
      }
    }

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

// ==================== BULK UPDATE ====================


// ==================== BULK DELETE ====================
const bulkDeleteProducts = async (req, res) => {
  const { ids } = req.body;

  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "Product IDs are required" });
    }

    const result = await prisma.product.deleteMany({
      where: { id: { in: ids.map((id) => parseInt(id)) } },
    });

    res.status(200).json({
      message: `Deleted ${result.count} product(s) successfully`,
      count: result.count,
    });
  } catch (error) {
    console.error("Error bulk deleting products:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// ==================== GET ALL (PAGINATED) ====================
const getAllProductsPagination = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "id",
    order = "desc",
    brand,
    modelId,
  } = req.query;

  const skip = (page - 1) * limit;

  try {
    const where = {
      // 🔍 Search filter
      ...(search && {
        OR: [
          { name: { contains: search } },
          { seoTitle: { contains: search } },
          { seoKeywords: { contains: search } },
          { slug: { contains: search } },
          { brand: { name: { contains: search } } },
          { model: { name: { contains: search } } },
        ],
      }),

      // 🏷 Brand filter
      ...(brand && {
        brand: {
          name: {
            equals: brand,
          },
        },
      }),

      // 🧩 Model filter
      ...(modelId && {
        modelId: Number(modelId),
      }),
    };

    const [products, totalItems] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { [sort]: order.toLowerCase() },
        include: {
          brand: { select: { name: true } },
          model: { select: { name: true } },
          productType: { select: { name: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.status(200).json({
      data: products,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== GET BY ID ====================
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        brand: { select: { id: true, name: true } },
        model: { select: { id: true, name: true } },
        productType: { select: { id: true, name: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== GET BY SLUG ====================
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        brand: { select: { id: true, name: true } },
        model: { select: { id: true, name: true } },
        productType: { select: { id: true, name: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== GET LATEST ====================
const getLatestProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        model: { select: { name: true } },
        productType: { select: { name: true } },
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching latest products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ==================== TOGGLE STOCK (PATCH) ====================
const toggleProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body; // boolean or number

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const newStock = stock !== undefined ? parseInt(stock) : product.stock;

    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { stock: newStock },
    });

    res.json({ message: "Stock updated successfully", product: updated });
  } catch (error) {
    console.error("Error toggling stock:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const importProductsFromCSV = async (req, res) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "No products provided" });
  }

  try {
    const brandCache = {};
    const modelCache = {};
    const typeCache = {};

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of products) {
      const {
        name,
        brand,
        model,
        type,
        color,
        stock,
        salePrice,
        regularPrice,
        ImageOne,
        ImageTwo,
        ImageThree,
        ImageFour,
        imageOne,
        imageTwo,
        imageThree,
        imageFour,
        description,
        weightLb,
        lengthIn,
        widthIn,
        heightIn,
        seoTitle,
        seoDescription,
        seoKeywords,
        slug,
      } = row;

      if (!name || !brand || !model || !type) {
        skipped++;
        continue;
      }

      // ---------- BRAND (must exist) ----------
      if (!brandCache[brand]) {
        const dbBrand = await prisma.brand.findUnique({
          where: { name: brand.trim() },
        });
        if (!dbBrand) {
          skipped++;
          continue;
        }
        brandCache[brand] = dbBrand.id;
      }

      // ---------- TYPE (must exist) ----------
      if (!typeCache[type]) {
        const dbType = await prisma.productType.findUnique({
          where: { name: type.trim() },
        });
        if (!dbType) {
          skipped++;
          continue;
        }
        typeCache[type] = dbType.id;
      }

      // ---------- MODEL (must exist) ----------
      const modelKey = `${model}_${brandCache[brand]}`;
      if (!modelCache[modelKey]) {
        const dbModel = await prisma.model.findUnique({
          where: {
            name_brandId: {
              name: model.trim(),
              brandId: brandCache[brand],
            },
          },
        });
        if (!dbModel) {
          skipped++;
          continue;
        }
        modelCache[modelKey] = dbModel.id;
      }

      // ---------- IMAGES ----------
      const img1 = ImageOne || imageOne || null;
      const img2 = ImageTwo || imageTwo || null;
      const img3 = ImageThree || imageThree || null;
      const img4 = ImageFour || imageFour || null;

      const productColor =
        type.trim() === "Enclosure" ? color?.trim() || null : null;

      // 1️⃣ Try to find existing product
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: name.trim(),
          brandId: brandCache[brand],
          modelId: modelCache[modelKey],
          typeId: typeCache[type],
          color: productColor,
        },
      });

      // 2️⃣ Update OR Create
      if (existingProduct) {
        await prisma.product.update({
          where: { id: existingProduct.id },
          data: {
            stock: parseInt(stock || 0, 10),
            salePrice: salePrice ? parseFloat(salePrice) : 0,
            regularPrice: regularPrice ? parseFloat(regularPrice) : 0,
            color: productColor,
            description: description?.trim() || null,
            weightLb: parseFloat(weightLb),
            lengthIn: parseFloat(lengthIn),
            widthIn: parseFloat(widthIn),
            heightIn: parseFloat(heightIn),
            seoTitle: seoTitle?.trim() || null,
            seoDescription: seoDescription?.trim() || null,
            seoKeywords: seoKeywords?.trim() || null,
            slug: slug?.trim() || null,
            imageOne: img1?.trim() || null,
            imageTwo: img2?.trim() || null,
            imageThree: img3?.trim() || null,
            imageFour: img4?.trim() || null,
          },
        });

        updated++;
      } else {
        await prisma.product.create({
          data: {
            name: name.trim(),
            stock: parseInt(stock || 0, 10),
            salePrice: salePrice ? parseFloat(salePrice) : 0,
            regularPrice: regularPrice ? parseFloat(regularPrice) : 0,
            color: productColor,
            description: description?.trim() || null,
            weightLb: parseFloat(weightLb),
            lengthIn: parseFloat(lengthIn),
            widthIn: parseFloat(widthIn),
            heightIn: parseFloat(heightIn),
            seoTitle: seoTitle?.trim() || null,
            seoDescription: seoDescription?.trim() || null,
            seoKeywords: seoKeywords?.trim() || null,
            slug: slug?.trim() || null,
            imageOne: img1?.trim() || null,
            imageTwo: img2?.trim() || null,
            imageThree: img3?.trim() || null,
            imageFour: img4?.trim() || null,
            brandId: brandCache[brand],
            modelId: modelCache[modelKey],
            typeId: typeCache[type],
          },
        });

        created++;
      }
    }

    res.json({
      success: true,
      created,
      updated,
      skipped,
      totalProcessed: products.length,
    });
  } catch (error) {
    console.error("CSV import failed:", error);
    res.status(500).json({
      message: "CSV import failed",
      error: error.message,
    });
  }
};

module.exports = {
  importProductsFromCSV,
  createProduct,
  updateProduct,
  bulkDeleteProducts,
  getAllProductsPagination,
  getProductById,
  getProductBySlug,
  getLatestProducts,
  toggleProductStock, // renamed for clarity
};
