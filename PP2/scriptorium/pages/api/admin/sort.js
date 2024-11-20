import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
  await auth(req, res, async () => {
    if (req.method === "GET") {
      const { contentType } = req.query;

      if (!["BlogPost", "Comment"].includes(contentType)) {
        return res.status(400).json({ error: "Invalid content type." });
      }

      try {
        const reportedContent = await prisma[contentType.toLowerCase()].findMany({
          where: {
            reports: { some: {} },
          },
          orderBy: {
            reports: {
              _count: "desc",
            },
          },
          include: {
            reports: true, // Include report details
            user: { select: { id: true, firstName: true, lastName: true } }, // Optional: include user details
          },
        });

        res.status(200).json(reportedContent);
      } catch (error) {
        res.status(400).json({ error: "Failed to retrieve content." });
      }
    } else {
      res.status(405).json({ error: "Method not allowed." });
    }
  }, "ADMIN");
}
