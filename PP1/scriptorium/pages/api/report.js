import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
  await auth(req, res, async () => {
    if (req.method === 'POST') {
      const { explanation, userId, blogPostId, commentId } = req.body;
      try {
        const report = await prisma.report.create({
          data: {
            explanation,
            userId,
            blogPostId,
            commentId,
          },
        });
        res.status(201).json(report);
      } catch (error) {
        res.status(400).json({ error: 'Failed to create report' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  });
}
