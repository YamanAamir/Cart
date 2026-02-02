const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all models
const getModels = async (req, res) => {
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
    const models = await prisma.model.findMany({
      include: { brand: true, products: true },
      orderBy: {
        id: order,
      },
      skip,
      take,
    });

    const totalItems = await prisma.model.count();

    res.json({
      data: models,
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

// Get single model
const getModel = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await prisma.model.findUnique({
      where: { id: parseInt(id) },
      include: {
        brand: true,
        products: {
          include: {
            productType: true,
          },
        },
      },
    });

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allModel = async (req, res) => {
  try {
    const model = await prisma.model.findMany();
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create model
const createModel = async (req, res) => {
  const { name, brandId } = req.body;
  try {
    const model = await prisma.model.create({
      data: {
        name,
        brand: { connect: { id: parseInt(brandId) } },
      },
    });
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update model
const updateModel = async (req, res) => {
  const { id } = req.params;
  const { name, brandId } = req.body;

  try {
    const model = await prisma.model.update({
      where: { id: parseInt(id) },
      data: {
        name,
        brand: brandId
          ? { connect: { id: parseInt(brandId) } }
          : undefined,
      },
    });
    res.json(model);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete model
const deleteModel = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.model.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const bulkDeleteModels = async (req, res) => {
  const { ids } = req.body;
  try {
    await prisma.model.deleteMany({
      where: {
        id: { in: ids.map((id) => parseInt(id)) },
      },
    });
    res.status(200).json({ message: "Products deleted successfully" });
  } catch (error) {
    console.error("Error bulk deleting:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getModels,
  getModel,
  allModel,
  createModel,
  updateModel,
  deleteModel,
  bulkDeleteModels,
};
