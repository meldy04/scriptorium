import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
        if (req.method === 'GET') {
            const { search, tags, language, page = 1, limit = 10 } = req.query;

            try {
                let filters = {};
                let userId = null;

                await auth(req, res, async () => {
                    userId = req.user?.userId;
                }, 'USER');

                if (userId) {
                    filters.userId = userId;
                } else {
                    filters.isPublic = true;
                }
                filters = {
                    ...filters,
                    ...(search && {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { explanation: { contains: search, mode: 'insensitive' } },
                            { tags: { has: search } },
                        ],
                    }),
                    ...(tags && { tags: { hasSome: tags.split(",") } }),
                    ...(language && { language }),
                };

                // Pagination
                const skip = (page - 1) * limit;
                const [templates, total] = await Promise.all([
                    prisma.template.findMany({
                        where: filters,
                        skip,
                        take: parseInt(limit, 10),
                        orderBy: { createdAt: "desc" },
                    }),
                    prisma.template.count({ where: filters }),
                ]);

                return res.status(200).json({
                    templates,
                    pagination: {
                        total,
                        page: parseInt(page, 10),
                        limit: parseInt(limit, 10),
                    },
                });
            } catch (error) {
                return res.status(500).json({ error: 'Failed to retrieve templates.' });
            }
        }
        else {
            res.status(405).json({error: 'Method not allowed.'});
        }
}