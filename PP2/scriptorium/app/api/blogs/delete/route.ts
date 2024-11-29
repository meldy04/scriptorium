import prisma from "@/utils/db";
import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
    const authResult = auth(req);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    if (!authResult.user) {
        return NextResponse.json(
            { error: 'Unauthorized or user information is missing' },
            { status: 401 }
        );
    }

    const { id } = await req.json();
    if (!id) {
        return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    const userId = authResult.user.userId;

    try {
        const blogPost = await prisma.blogPost.findFirst({
            where: { id, userId },
        });

        if (!blogPost) {
            return NextResponse.json({ error: 'Blog post not found or not authorized' }, { status: 404 });
        }

        await prisma.blogPost.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Blog post successfully deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete blog post', details: (error instanceof Error) ? error.message : 'Unknown error' }, { status: 400 });
    }
}