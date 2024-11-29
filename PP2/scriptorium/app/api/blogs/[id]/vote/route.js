import prisma from "@/utils/db";
import { auth } from "@/utils/auth";
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { voteType } = await req.json();

    const response = new NextResponse();

    await auth(req, response, async () => {
        try {
            if (voteType !== 'up' && voteType !== 'down') {
                response.status(400).json({ error: 'Invalid vote type' });
                return response;
            }

            const voteIncrement = voteType === 'up' ? 1 : -1;

            const blogPost = await prisma.blogPost.update({
                where: { id: parseInt(id) },
                data: {
                    votes: {
                        increment: voteIncrement
                    }
                }
            });
            return response.status(200).json(blogPost);
        } catch {
            return response.status(400).json({ error: 'Failed to register vote' });
        }
    }, 'USER');

    return response;
};