import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    await auth(req, res, async () => {
        if (req.method === 'POST') {
            const { title, description, content, tags, templateIds = [] } = req.body;
            const userId = req.user.userId;

            try {
                const templates = await prisma.template.findMany({
                    where: { id: { in: templateIds } },
                });

                if(templateIds.length !== templates.length) {
                    return res.status(400).json({ error: 'One or more template IDs are invalid or do not exist.' });
                }

                const blogPost = await prisma.blogPost.create({
                    data: {
                        title, description, content, tags, userId,
                        templates: { connect: templateIds.map((id) => ({ id })) },
                    },
                    include: {
                        templates: true
                    },
                });

                res.status(201).json(blogPost);
            } catch {
                res.status(400).json({ error: 'Failed to create blog post' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    }, 'USER');
}