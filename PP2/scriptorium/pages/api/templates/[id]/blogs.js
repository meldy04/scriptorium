import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;
        const { sort = 'votes', order = 'desc', page = 1, limit = 10 } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Template ID is required." });
        }

        try {
            const blogPosts = await prisma.blogPost.findMany({
                where: {
                    templates: {
                        some: { id: parseInt(id) },
                    },
                },
                orderBy: { [sort]: order },
                skip: (page - 1) * limit,
                take: parseInt(limit),
            });

            res.status(200).json(blogPosts);
        } catch (error) {
            res.status(500).json({ error: "Something went wrong." });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
