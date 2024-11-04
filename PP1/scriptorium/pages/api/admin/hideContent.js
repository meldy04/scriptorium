import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
  await auth(req, res, async () => {
    if (req.method === 'POST') {
      const { contentId, contentType } = req.body;
      try {
        const updatedContent = await prisma[contentType.toLowerCase()].update({
          where: { id: parseInt(contentId) },
          data: { isHidden: true },
        });
        res.status(200).json(updatedContent);
      } catch (error) {
        res.status(400).json({ error: 'Failed to hide content' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
