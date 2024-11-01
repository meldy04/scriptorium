export default async function handler(req, res) {
    const { id } = req.query;
    const { voteType, userId } = req.body;

    try {
        const blogPost = await prisma.blogPost.update({
            where: { id: parseInt(id) },
            data: {
                votes: {
                    increment: voteType === 'up' ? 1 : -1
                }
            }
        });
        res.status(200).json(blogPost);
    } catch (error) {
        res.status(400).json({ error: 'Failed to register vote' });
    }
}