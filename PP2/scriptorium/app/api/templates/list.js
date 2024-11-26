import prisma from "../../../utils/db";
import auth from "../../../utils/auth";

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { search, tags, language, page = "1", limit = "10" } = req.query;

        try {
            let filters = {};
            let userId = null;

            await auth(req, res, async () => {
                userId = req.user?.userId;
            }, "USER");

            if (userId) {
                filters.userID = userId;
            } else {
                filters.isPublic = true;
            }

            filters = {
                ...filters,
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: "insensitive" } },
                        { explanation: { contains: search, mode: "insensitive" } },
                        { tags: { contains: search } },
                    ],
                }),
                ...(tags && { tags: { contains: tags.split(",") } }),
                ...(language && { language }),
            };

            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const skip = (pageNum - 1) * limitNum;

            // Fetch templates and total count
            const [templates, total] = await Promise.all([
                prisma.template.findMany({
                    where: filters,
                    skip,
                    take: limitNum,
                    orderBy: { createdAt: "desc" },
                }),
                prisma.template.count({ where: filters }),
            ]);

            return res.status(200).json({
                templates,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                },
            });
        } catch {
            return res.status(500).json({ error: "Failed to retrieve templates." });
        }
    } else {
        res.status(405).json({ error: "Method not allowed." });
    }
}
