import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    await auth(req, res, async () => {
        if (req.method === 'DELETE') {
            const { id } = req.body;

            try {
                await prisma.blogPost.delete({
                    where: { id },
                });
                return res.status(204).json({ message: 'Blog post successfully deleted' });
            } catch (error) {
                return res.status(400).json({ error: 'Failed to delete blog post', details: error.message });
            }
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    });
}
