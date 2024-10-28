export default async function handler(req, res) {
    const { id } = req.query;

    try {
        await prisma.template.delete({ where: {id: parseInt(id) }});
        res.status(200).json({ message: 'Template successfully deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete template' });
    }
}