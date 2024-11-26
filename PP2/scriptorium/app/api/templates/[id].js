import prisma from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const template = await prisma.template.findUnique({
        where: { id: parseInt(id) },
      });
      res.status(200).json(template);
    } catch {
      res.status(404).json({ error: 'Template not found' });
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;
    const { title, explanation, tags, code, language } = req.body;
    const userId = req.user?.userId;

    try {
      // Ensure the template belongs to the user
      const template = await prisma.template.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!template || template.userID !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedTemplate = await prisma.template.update({
        where: { id: parseInt(id, 10) },
        data: { title, explanation, tags, code, language },
      });

      res.status(200).json(updatedTemplate);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template." });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.query;
    const userId = req.user?.userId;

    try {
      const template = await prisma.template.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!template || template.userID !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await prisma.template.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(200).json({ message: "Template deleted successfully." });
    } catch {
      res.status(500).json({ error: "Failed to delete template." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}