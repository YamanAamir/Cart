const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

const getHeroSections = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    const skip = (page - 1) * limit;
    try {
        const where = search
            ? {
                OR: [
                    { title: { contains: search } },
                ],
            }
            : {};

        const [heroSections, total] = await prisma.$transaction([
            prisma.heroSection.findMany({
                where,
                orderBy: { createdAt: 'asc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.heroSection.count({ where }),
        ]);
        res.status(200).json({
            data: heroSections,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get hero sections error:', error);
        res.status(500).json({ error: 'Failed to fetch hero sections' });
    }
};

const getHeroSectionById = async (req, res) => {
    try {
        const { id } = req.params;
        const heroSection = await prisma.heroSection.findUnique({
            where: { id: parseInt(id) },
        });
        if (!heroSection) {
            return res.status(404).json({ error: 'Hero section not found' });
        }
        res.status(200).json({ data: heroSection });
    } catch (error) {
        console.error('Get hero section by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch hero section' });
    }
};

const createHeroSection = async (req, res) => {
    try {
        const { title, description, ctaTextOne, ctaLinkOne, ctaTextTwo, ctaLinkTwo, imgAlt } = req.body;
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/hero/${req.file.filename}`;
        }
        const newHeroSection = await prisma.heroSection.create({
            data: { title, description, ctaTextOne, ctaLinkOne, ctaTextTwo, ctaLinkTwo, imageUrl, imgAlt },
        });
        res.status(201).json({ heroSection: newHeroSection, message: 'Hero section created successfully' });
    }
    catch (error) {
        console.error('Create hero section error:', error);
        res.status(500).json({ error: 'Failed to create hero section' });
    }
};

const updateHeroSection = async (req, res) => {

    try {
        const { id } = req.params;
        const { title, description, ctaTextOne, ctaLinkOne, ctaTextTwo, ctaLinkTwo, imgAlt } = req.body;

        const existingHero = await prisma.heroSection.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingHero) {
            return res.status(404).json({ error: 'Hero section not found' });
        }

        let imageUrl = existingHero.imageUrl;
        if (req.file) {
            // Delete old image
            if (existingHero.imageUrl) {
                const oldPath = path.join(process.cwd(), existingHero.imageUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            imageUrl = `/uploads/hero/${req.file.filename}`;
        }

        const updatedHeroSection = await prisma.heroSection.update({
            where: { id: parseInt(id) },
            data: { title, description, ctaTextOne, ctaLinkOne, ctaTextTwo, ctaLinkTwo, imageUrl, imgAlt },
        });
        res.status(200).json({ heroSection: updatedHeroSection, message: 'Hero section updated successfully' });
    }
    catch (error) {
        console.error('Update hero section error:', error);
        res.status(500).json({ error: 'Failed to update hero section' });
    }
};

const deleteHeroSection = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHeroSection = await prisma.heroSection.update({
            where: { id: parseInt(id) },
            data: { isActive: false },
        });
        res.status(200).json({ message: 'Hero section deleted successfully', data: deletedHeroSection });
    }
    catch (error) {
        console.error('Delete hero section error:', error);
        res.status(500).json({ error: 'Failed to delete hero section' });
    }
};

const bulkDeleteHeroSections = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of IDs to delete
        await prisma.heroSection.deleteMany({
            where: { id: { in: ids.map(id => parseInt(id)) } },
        });
        res.status(200).json({ message: 'Hero sections deleted successfully' });
    }
    catch (error) {
        console.error('Bulk delete hero sections error:', error);
        res.status(500).json({ error: 'Failed to delete hero sections' });
    }
};

const listHeroSections = async (req, res) => {
    try {
        const heroSections = await prisma.heroSection.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
        });
        res.status(200).json({ data: heroSections });
    } catch (error) {
        console.error('List hero sections error:', error);
        res.status(500).json({ error: 'Failed to fetch hero sections' });
    }
};

module.exports = {
    getHeroSections,
    getHeroSectionById,
    createHeroSection,
    updateHeroSection,
    deleteHeroSection,
    bulkDeleteHeroSections,
    listHeroSections,
};