import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
  await auth(req, res, async () => {
    if (req.method === "POST") {
      const { contentId, contentType } = req.body;

      if (!["BlogPost", "Comment"].includes(contentType)) {
        return res.status(400).json({ error: "Invalid content type." });
      }

      try {
        const updatedContent = await prisma[contentType.toLowerCase()].update({
          where: { id: parseInt(contentId) },
          data: { isHidden: true },
        });

        res.status(200).json({
          message: `${contentType} successfully hidden.`,
          updatedContent,
        });
      } catch {
        res.status(400).json({ error: "Failed to hide content." });
      }
    } else {
      res.status(405).json({ error: "Method not allowed." });
    }
  }, "ADMIN");
}
