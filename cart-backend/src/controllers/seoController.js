const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get SEO for a specific page
const getPageSeo = async (req, res) => {
    const { pageName } = req.params;
    try {
        const seo = await prisma.pageSeo.findUnique({
            where: { pageName },
        });
        if (!seo) {
            return res.status(404).json({ message: "SEO not found for this page" });
        }
        res.json(seo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update or Create SEO for a page
const updatePageSeo = async (req, res) => {
    const { pageName } = req.params;
    const { seoTitle, seoDescription, seoKeywords, slug } = req.body;
    try {
        const seo = await prisma.pageSeo.upsert({
            where: { pageName },
            update: {
                seoTitle,
                seoDescription,
                seoKeywords,
                slug,
            },
            create: {
                pageName,
                seoTitle,
                seoDescription,
                seoKeywords,
                slug,
            },
        });
        res.json(seo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all static page SEOs
const getAllPageSeos = async (req, res) => {
    try {
        const seos = await prisma.pageSeo.findMany();
        res.json(seos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getPageSeo,
    updatePageSeo,
    getAllPageSeos,
};
