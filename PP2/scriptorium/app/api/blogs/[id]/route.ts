import prisma from "@/utils/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();

    if (!id) {
        return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    try {
        const blogPost = await prisma.blogPost.findUnique({
            where: { id: Number(id) },
            include: {
                comments: true,
                user: { select: { firstName: true } },
            },
        });

        if (!blogPost) {
            return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
        }

        return NextResponse.json(blogPost, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
    }
}