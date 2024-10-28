export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { title, explanation, tags, code, language, userId } = req.body;
  
      try {
        const template = await prisma.template.create({
          data: { title, explanation, tags, code, language, userId },
        });
        res.status(201).json(template);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create template' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
  