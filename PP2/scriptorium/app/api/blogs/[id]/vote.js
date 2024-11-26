import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    const { id } = req.query;
    const { voteType } = req.body;

    if (req.method === 'POST') {
        await auth(req, res, async () => {
            try {
                if (voteType !== 'up' && voteType !== 'down') {
                    return res.status(400).json({ error: 'Invalid vote type' });
                }

                const voteIncrement = voteType === 'up' ? 1 : -1;

                const blogPost = await prisma.blogPost.update({
                    where: { id: parseInt(id) },
                    data: {
                        votes: {
                            increment: voteIncrement
                        }
                    }
                });
                return res.status(200).json(blogPost);
            } catch {
                return res.status(400).json({ error: 'Failed to register vote' });
            }
        }, 'USER');
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}