export default async function handler(req, res) {
    const { id } = req.query;
    const { content, userId } = req.body;

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
        res.status(400).json({ error: 'Failed to add comment'});
    }
}