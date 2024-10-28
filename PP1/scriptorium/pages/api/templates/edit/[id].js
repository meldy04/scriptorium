export default async function handler(req, res) {
    const { id } = req.query;
    const { title, explanation, tags, code, language } = req.body;
    
    try {
      const updatedTemplate = await prisma.template.update({
        where: { id: parseInt(id) },
        data: { title, explanation, tags, code, language },
      });
      res.status(200).json(updatedTemplate);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update template' });
    }
  }  