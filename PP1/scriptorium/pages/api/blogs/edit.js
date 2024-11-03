import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    await auth(req, res, async () => {
        if (req.method === 'PUT') {
            const { id, title, description, content, tags } = req.body;

            try {
                const updatedBlogPost = await prisma.blogPost.update({
                    where: { id },
                    data: { title, description, content, tags },
                });
                return res.status(200).json(updatedBlogPost);
            } catch (error) {
                console.error("Error updating blog post:", error);
                return res.status(400).json({ error: 'Failed to update blog post', details: error.message });
            }
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    });
}
