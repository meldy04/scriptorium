import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
  await auth(req, res, async () => {
    if (req.method === 'POST') {
      const { title, explanation, tags, code, language } = req.body;
      const userId = req.user.userId;

      try {
        if (!userId) {
          return res.status(403).json({ error: 'Denied - please login to create a template' });
        }

        const template = await prisma.template.create({
          data: {
            title,
            explanation,
            tags,
            code,
            language,
            user: { connect: { id: userId } }
          },
        });
        return res.status(201).json(template);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create template' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }, 'USER');
}
