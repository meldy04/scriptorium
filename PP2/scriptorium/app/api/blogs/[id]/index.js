import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { query, sort = 'id', order = 'desc', page = 1, limit = 10 } = req.query;

        try {
            const whereClause = query
                ? {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { content: { contains: query, mode: 'insensitive' } },
                        { tags: { contains: query, mode: 'insensitive' } },
                        {
                            templates: {
                                some: {
                                    OR: [
                                        { title: { contains: query, mode: 'insensitive' } },
                                        { code: { contains: query, mode: 'insensitive' } },
                                    ],
                                },
                            },
                        },
                    ],
                }
                : undefined;

            // Fetch blog posts with pagination and sorting
            const blogPosts = await prisma.blogPost.findMany({
                where: whereClause,  // Apply the filter
                include: {
                    templates: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    comments: {
                        select: {
                            id: true,
                            content: true,
                        },
                    },
                },
                orderBy: {
                    [sort]: order,
                },
                skip: (page - 1) * limit,
                take: parseInt(limit),
            });

            res.status(200).json(blogPosts);
        } catch (error) {
            res.status(500).json({
                error: "Something went wrong. Please try again later.",
                details: error.message || error,
            });
        }
    } else if (req.method === 'POST') {
        // Authentication only needed for creating a new blog post
        await auth(req, res, async () => {
            const { title, description, content, tags, templateIds = [] } = req.body;
            const userId = req.user.userId;

            try {
                const templates = await prisma.template.findMany({
                    where: { id: { in: templateIds } },
                });

                if (templateIds.length !== templates.length) {
                    return res.status(400).json({ error: 'One or more template IDs are invalid or do not exist.' });
                }

                const blogPost = await prisma.blogPost.create({
                    data: {
                        title, description, content, tags, userId,
                        templates: { connect: templateIds.map((id) => ({ id })) },
                    },
                    include: {
                        templates: true
                    },
                });

                res.status(201).json(blogPost);
            } catch {
                res.status(400).json({ error: 'Failed to create blog post' });
            }
        }, 'USER');
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
