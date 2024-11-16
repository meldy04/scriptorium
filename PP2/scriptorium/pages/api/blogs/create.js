import prisma from "@/utils/db";
import auth from "@/utils/auth";

export default async function handler(req, res) {
    await auth(req, res, async () => {
        if (req.method === 'POST') {
            const { title, description, content, tags } = req.body;
            const userId = req.user.userId;
    
            try {
                const blogPost = await prisma.blogPost.create({
                    data: { title, description, content, tags, userId },
                });
                res.status(201).json(blogPost);
            } catch (error) {
                res.status(400).json({ error: 'Failed to create blog post' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    }); 
}