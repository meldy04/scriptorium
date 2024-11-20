import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { templateId, title, explanation, tags, code, language } = req.body;

        try {
            const ogTemplate = await prisma.template.findUnique({
                where: { id: templateId },
            });

            if (!ogTemplate) {
                return res.status(404).json({ error: 'Template not found' });
            }

            const forkedData = {
                title: title || `Fork of ${ogTemplate.title}`,
                explanation: explanation || ogTemplate.explanation,
                tags: tags || ogTemplate.tags,
                code: code || ogTemplate.code,
                langauge: lanuage || ogTemplate.language,
            };

            await auth(req, res, async () => {
                const userId = req.user.userId;
                if(!userId) {
                    return res.status(403).json({ error: 'Denied - please login to save your template.' });
                }
                const newTemplate = await prisma.template.create({
                    data: {
                        ...forkedData,
                        isFork: true,
                        parentId: templateId,
                        user: { connect: { id: userId } },
                    },
                });

                return res.status(201).json(newTemplate);
            }, 'USER');
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fork template.' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed.' });
    }
}