import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    const { id } = req.query;

    if(req.method === 'POST') {
        await auth(req, res, async () => {
            const { content } = req.body;
            const userId = req.user.userId;

            if (!content) {
                return res.status(400).json({ error: 'Body is required' });
            }

            try {
                const comment = await prisma.comment.create({
                    data: {
                        content,
                        userId,
                        blogPostId: parseInt(id)
                    },
                });
                res.status(201).json(comment);
            } catch (error) {
                console.error("Error adding comment:", error);
                res.status(400).json({ error: 'Failed to add comment'});
            }
        }, 'USER');
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}