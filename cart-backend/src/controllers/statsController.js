const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getStatsCards = async (req, res) => {
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

        const [statsCards, total] = await prisma.$transaction([
            prisma.statsCards.findMany({
                where,
                orderBy: { createdAt: 'asc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.statsCards.count({ where }),
        ]);
        res.status(200).json({
            data: statsCards,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get stats cards error:', error);
        res.status(500).json({ error: 'Failed to fetch stats cards' });
    }
};

const getStatsCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const statsCard = await prisma.statsCards.findUnique({
            where: { id: parseInt(id) },
        });
        if (!statsCard) {
            return res.status(404).json({ error: 'Stats card not found' });
        }
        res.status(200).json({ data: statsCard });
    } catch (error) {
        console.error('Get stats card by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch stats card' });
    }
};

const createStatsCard = async (req, res) => {
    try {
        const { title, value, link } = req.body;
        const newStatsCard = await prisma.statsCards.create({
            data: { title, value, link },
        });
        res.status(201).json({ statsCard: newStatsCard, message: 'Stats card created successfully' });
    }
    catch (error) {
        console.error('Create stats card error:', error);
        res.status(500).json({ error: 'Failed to create stats card' });
    }
};

const updateStatsCard = async (req, res) => {

    try {
        const { id } = req.params;
        const { title, value, link } = req.body;
        const updatedStatsCard = await prisma.statsCards.update({
            where: { id: parseInt(id) },
            data: { title, value, link },
        });
        res.status(200).json({ statsCard: updatedStatsCard, message: 'Stats card updated successfully' });
    }
    catch (error) {
        console.error('Update stats card error:', error);
        res.status(500).json({ error: 'Failed to update stats card' });
    }
};

const deleteStatsCard = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.statsCards.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Stats card deleted successfully' });
    }
    catch (error) {
        console.error('Delete stats card error:', error);
        res.status(500).json({ error: 'Failed to delete stats card' });
    }
};

const bulkDeleteStatsCards = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of IDs to delete
        await prisma.statsCards.deleteMany({
            where: { id: { in: ids.map(id => parseInt(id)) } },
        });
        res.status(200).json({ message: 'Stats cards deleted successfully' });
    }
    catch (error) {
        console.error('Bulk delete stats cards error:', error);
        res.status(500).json({ error: 'Failed to delete stats cards' });
    }
};

module.exports = {
    getStatsCards,
    createStatsCard,
    updateStatsCard,
    deleteStatsCard,
    bulkDeleteStatsCards,
    getStatsCardById,
};