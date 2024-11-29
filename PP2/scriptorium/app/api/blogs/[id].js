import prisma from "@/utils/db";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const blogPost = await prisma.blogPost.findUnique({
                where: { id: Number(id) },
                include: {
                    comments: true,
                    user: { select: { firstName: true } },
                },
            });

            if (!blogPost) {
                return res.status(404).json({ error: 'Blog post not found' });
            }

            return res.status(200).json(blogPost);
        } catch {
            return res.status(500).json({ error: 'Failed to fetch blog post' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
