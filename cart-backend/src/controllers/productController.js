const { PrismaClient } = require("@prisma/client");
const { put, del } = require("@vercel/blob");
const prisma = new PrismaClient();

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
    } = req.body;

    // Required fields validation
    if (!name || !regularPrice || !brandId || !modelId || !typeId) {
      return res.status(400).json({
        message: "name, regularPrice, brandId, modelId, and typeId are required",
      });
    }

    // Parse numeric fields safely
    const parsedRegularPrice = parseFloat(regularPrice);
    const parsedSalePrice   = salePrice   ? parseFloat(salePrice)   : null;
    const parsedStock       = parseInt(stock, 10);
    const parsedBrandId     = parseInt(brandId, 10);
    const parsedModelId     = parseInt(modelId, 10);
    const parsedTypeId      = parseInt(typeId, 10);

    const parsedWeightLb = weightLb ? parseFloat(weightLb) : null;
    const parsedLengthIn = lengthIn ? parseFloat(lengthIn) : null;
    const parsedWidthIn  = widthIn  ? parseFloat(widthIn)  : null;
    const parsedHeightIn = heightIn ? parseFloat(heightIn) : null;

    // Basic numeric validations
    if (isNaN(parsedRegularPrice) || parsedRegularPrice <= 0) {
      return res.status(400).json({ message: "regularPrice must be a valid number > 0" });
    }
    if (parsedSalePrice !== null && (isNaN(parsedSalePrice) || parsedSalePrice < 0)) {
      return res.status(400).json({ message: "salePrice must be a non-negative number or null" });
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ message: "stock must be a non-negative integer" });
    }

    // Optional dimension validations (uncomment/adjust strictness as needed)
    if (parsedWeightLb !== null && (isNaN(parsedWeightLb) || parsedWeightLb < 0)) {
      return res.status(400).json({ message: "weightLb must be a non-negative number" });
    }
    if (parsedLengthIn !== null && (isNaN(parsedLengthIn) || parsedLengthIn <= 0)) {
      return res.status(400).json({ message: "lengthIn must be a positive number" });
    }
    // You can add similar checks for widthIn / heightIn if they are mandatory when provided

    // Handle image uploads
    const imageFields = {
      imageOne: null,
      imageTwo: null,
      imageThree: null,
      imageFour: null,
    };

    const uploadedFiles = req.files || [];
    if (uploadedFiles.length > 4) {
      return res.status(400).json({ message: "Maximum 4 images allowed" });
    }

    uploadedFiles.forEach((file, index) => {
      if (index >= 4) return;
      const fieldName = `image${index === 0 ? "One" : index === 1 ? "Two" : index === 2 ? "Three" : "Four"}`;
      imageFields[fieldName] = `/uploads/products/${file.filename}`;
    });

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        regularPrice: parsedRegularPrice,
        salePrice: parsedSalePrice,
        stock: isNaN(parsedStock) ? 0 : parsedStock,
        color: color?.trim() || null,
        brandId: parsedBrandId,
        modelId: parsedModelId,
        typeId: parsedTypeId,
        weightLb: parsedWeightLb,
        lengthIn: parsedLengthIn,
        widthIn: parsedWidthIn,
        heightIn: parsedHeightIn,
        description: description?.trim() || null,
        imageOne: imageFields.imageOne,
        imageTwo: imageFields.imageTwo,
        imageThree: imageFields.imageThree,
        imageFour: imageFields.imageFour,
      },
      include: {
        brand:       { select: { name: true } },
        model:       { select: { name: true } },
        productType: { select: { name: true } },
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid foreign key: brandId, modelId, or typeId does not exist",
      });
    }
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "A product with similar unique constraints already exists",
      });
    }
    res.status(500).json({
      message: "Failed to create product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// ==================== BULK CREATE ====================


// ==================== UPDATE PRODUCT ====================
const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    regularPrice,
    salePrice,
    stock,
    color,
    brandId,
    modelId,
    typeId,
    weightLb,
    lengthIn,
    widthIn,
    heightIn,
    description,
  } = req.body;

  try {
    const productId = parseInt(id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        regularPrice: true,
        salePrice: true,
        stock: true,
        color: true,
        brandId: true,
        modelId: true,
        typeId: true,
        weightLb: true,
        lengthIn: true,
        widthIn: true,
        heightIn: true,
        description: true,
        imageOne: true,
        imageTwo: true,
        imageThree: true,
        imageFour: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ───────────────────────────────────────
    //              Image handling
    // ───────────────────────────────────────
    const currentImages = {
      imageOne: existingProduct.imageOne,
      imageTwo: existingProduct.imageTwo,
      imageThree: existingProduct.imageThree,
      imageFour: existingProduct.imageFour,
    };

    const imageFields = ["imageOne", "imageTwo", "imageThree", "imageFour"];

    // Named fields approach (recommended)
    for (const field of imageFields) {
      const file = req.files?.[field]?.[0];
      if (!file) continue;

      // Delete old file if exists
      if (currentImages[field]) {
        const oldPath = path.join(process.cwd(), "uploads", "products", path.basename(currentImages[field]));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      currentImages[field] = `/uploads/products/${file.filename}`;
    }

    // ───────────────────────────────────────
    //           Build update data
    // ───────────────────────────────────────
    const updateData = {};

    if (name !== undefined)          updateData.name          = name.trim();
    if (regularPrice !== undefined)  updateData.regularPrice  = parseFloat(regularPrice);
    if (salePrice !== undefined)     updateData.salePrice     = salePrice ? parseFloat(salePrice) : null;
    if (stock !== undefined)         updateData.stock         = parseInt(stock, 10);
    if (color !== undefined)         updateData.color         = color?.trim() || null;
    if (brandId !== undefined)       updateData.brandId       = parseInt(brandId, 10);
    if (modelId !== undefined)       updateData.modelId       = parseInt(modelId, 10);
    if (typeId !== undefined)        updateData.typeId        = parseInt(typeId, 10);

    if (weightLb !== undefined)      updateData.weightLb      = weightLb ? parseFloat(weightLb) : null;
    if (lengthIn !== undefined)      updateData.lengthIn      = lengthIn ? parseFloat(lengthIn) : null;
    if (widthIn !== undefined)       updateData.widthIn       = widthIn  ? parseFloat(widthIn)  : null;
    if (heightIn !== undefined)      updateData.heightIn      = heightIn ? parseFloat(heightIn) : null;
    if (description !== undefined)   updateData.description   = description?.trim() || null;

    // Always include current (possibly updated) image paths
    Object.assign(updateData, currentImages);

    // Optional: Add basic validation before update (especially for numeric fields)
    if ('regularPrice' in updateData && (isNaN(updateData.regularPrice) || updateData.regularPrice <= 0)) {
      return res.status(400).json({ message: "regularPrice must be > 0" });
    }
    if ('salePrice' in updateData && updateData.salePrice !== null && (isNaN(updateData.salePrice) || updateData.salePrice < 0)) {
      return res.status(400).json({ message: "salePrice must be >= 0 or null" });
    }
    // Add similar checks for dimensions if you want strict control

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        brand:       { select: { name: true } },
        model:       { select: { name: true } },
        productType: { select: { name: true } },
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Invalid foreign key: brandId, modelId, or typeId does not exist",
      });
    }
    res.status(500).json({
      message: "Failed to update product",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
  getLatestProducts,
  toggleProductStock, // renamed for clarity
};
