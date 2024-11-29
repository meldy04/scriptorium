import { NextRequest } from 'next/server';
import prisma from '@/utils/db';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const searchQuery = searchParams.get('searchQuery')?.toLowerCase() || '';
        const templates = await prisma.template.findMany({
            where: {
                isPublic: true,
                OR: [
                    { title: { contains: searchQuery } },
                    { tags: { contains: searchQuery } },
                    { explanation: { contains: searchQuery } },
                ]
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                explanation: true,
                language: true,
                code: true,
                tags: true,
                user: { select: { firstName: true } },
            },
        });

        return new Response(JSON.stringify(templates), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch {
        return new Response(JSON.stringify({ error: 'Failed to fetch templates' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}