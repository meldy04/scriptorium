import prisma from "@/utils/db";
import { auth } from "@/utils/auth";
import { NextResponse } from 'next/server';

/**
 * @param {import('next/server').NextRequest} req
 */

export async function POST(req) {
    const authResult = auth(req);
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    const { title, description, content, tags, templateIds = [] } = await req.json();
    const userId = authResult.user.userId;

    try {
        const templates = await prisma.template.findMany({
            where: { id: { in: templateIds } },
        });

        if (templateIds.length !== templates.length) {
            return NextResponse.json({ error: 'One or more template IDs are invalid or do not exist.' }, { status: 400 });
        }

        const blogPost = await prisma.blogPost.create({
            data: {
                title,
                description,
                content,
                tags,
                userId,
                templates: { connect: templateIds.map((id) => ({ id })) },
            },
            include: {
                templates: true,
            },
        });

        return NextResponse.json(blogPost, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 400 });
    }
}