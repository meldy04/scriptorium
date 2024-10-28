export default async function handler(req, res) {
    const { id } = req.query;
    try {
      const template = await prisma.template.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(template);
    } catch (error) {
      res.status(404).json({ error: 'Template not found' });
    }
  }
  