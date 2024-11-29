import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';

    try {
        const blogs = await prisma.blogPost.findMany({
            where: {
                isHidden: false,
                OR: [
                    {
                        title: {
                            contains: search.toLowerCase(),
                        },
                    },
                    {
                        content: {
                            contains: search.toLowerCase(),
                        },
                    },
                    {
                        tags: {
                            contains: search.toLowerCase(),
                        },
                    },
                    {
                        templates: {
                            some: {
                                code: {
                                    contains: search.toLowerCase(),
                                },
                            },
                        },
                    },
                ],
            },
            orderBy: { votes: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                user: { select: { firstName: true } },
                votes: true,
                comments: true,
                templates: { select: { code: true } },
            },
        });

        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        return NextResponse.json({ message: 'Failed to fetch blogs' }, { status: 500 });
    }
}
