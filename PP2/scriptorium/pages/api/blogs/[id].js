import prisma from "@/utils/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: "Blog post ID is required." });
        }

        try {
            const blogPost = await prisma.blogPost.findUnique({
                where: { id: parseInt(id) },
                include: { templates: true },
            });

            if (!blogPost) {
                return res.status(404).json({ error: "Blog post not found." });
            }

            res.status(200).json(blogPost);
        } catch (error) {
            res.status(500).json({ error: "Something went wrong." });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
