import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const blogPosts = await prisma.blogPost.findMany({
                orderBy: { votes: 'desc' }, // Sort blog posts by votes in descending order
                include: {
                    comments: {
                        orderBy: { votes: 'desc' }, // Sort comments by votes in descending order
                    },
                },
            });
            return res.status(200).json(blogPosts);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch blog posts' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
