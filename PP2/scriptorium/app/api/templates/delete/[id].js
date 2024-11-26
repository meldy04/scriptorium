import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    await auth(req, res, async () => {
        if (req.method === 'DELETE') {
            const { id } = req.body;

            try {
                await prisma.template.delete({ where: { id: parseInt(id) }});
                return res.status(200).json({ message: 'Template successfully deleted' });
            } catch {
                return res.status(400).json({ error: 'Failed to delete template' });
            }
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    }, 'USER');
}