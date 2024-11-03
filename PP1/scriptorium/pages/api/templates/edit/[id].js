import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    const { id } = req.query;

    await auth(req, res, async () => {
      if (req.method === 'PUT') {
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
      } else if (req.method === 'GET') {
        try {
          const template = await prisma.template.findUnique({
            where: { id: parseInt(id) }
          });
          if (template) {
            res.status(200).json(template);
          } else {
            res.status(404).json({ error: 'Template not found' });
          }
        } catch (error) {
          res.status(404).json({ error: 'Template not found' });
        }
      } else {
        res.status(405).json({ error: 'Method not allowed'});
      }
    });
}  