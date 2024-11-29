import prisma from "@/utils/db";
import { auth } from "@/utils/auth";

export async function GET(req) {
    try {
        const { user } = auth(req);

        if (!user || !user.userId) {
            console.error('User not authenticated:', user);
            return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 });
        }

        const userBlogs = await prisma.blogPost.findMany({
            where: {
                userId: user.userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                content: true,
            },
        });

        return new Response(JSON.stringify(userBlogs), { status: 200 });
    } catch (error) {
        console.error('Error fetching user blogs:', error.message || error);
        const responseBody = JSON.stringify({ error: 'Failed to fetch blogs' });
        return new Response(responseBody, { status: 500 });
    }
}