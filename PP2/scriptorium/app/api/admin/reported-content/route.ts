import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { auth } from '@/utils/auth';

type UserSummary = {
    id: number;
    firstName: string;
    lastName: string;
};
type BlogPost = {
    id: number;
    title: string;
    description: string;
    reportCount: number;
    user: { id: number; firstName: string; lastName: string };
    reports: Report[];
};

type Comment = {
    id: number;
    reportCount: number;
    user: { id: number; firstName: string; lastName: string };
    reports: Report[];
};

type Report = {
    id: number;
    userId: number;
    explanation: string;
    blogPostId: number | null;
    commentId: number | null;
    createdAt: Date;
};

type ReportedContent = {
    id: number;
    title?: string;
    description?: string;
    reportCount: number;
    user: UserSummary;
    reports: Report[];
};

export async function GET(req: NextRequest) {
    const { error, user } = auth(req);

    if (error || !user || user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = req.nextUrl.searchParams.get('contentType');

    if (!contentType || !['BlogPost', 'Comment'].includes(contentType)) {
        return NextResponse.json({ error: 'Invalid content type.' }, { status: 400 });
    }

    try {
        let reportedContent: ReportedContent[] = [];

        if (contentType === 'BlogPost') {
            const blogPosts = await prisma.blogPost.findMany({
                where: { reports: { some: {} } },
                orderBy: { reportCount: 'desc' },
                include: {
                    reports: true,
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
            });

            reportedContent = blogPosts.map((bp: BlogPost) => ({
                id: bp.id,
                title: bp.title,
                description: bp.description,
                reportCount: bp.reportCount,
                user: bp.user,
                reports: bp.reports,
            }));
        } else if (contentType === 'Comment') {
            const comments = await prisma.comment.findMany({
                where: { reports: { some: {} } },
                orderBy: { reportCount: 'desc' },
                include: {
                    reports: true,
                    user: { select: { id: true, firstName: true, lastName: true } },
                },
            });

            reportedContent = comments.map((comment: Comment) => ({
                id: comment.id,
                reportCount: comment.reportCount,
                user: comment.user,
                reports: comment.reports,
            }));
        }

        return NextResponse.json(reportedContent);
    } catch (error) {
        console.error('Error fetching reported content:', error);
        return NextResponse.json({ error: 'Failed to retrieve content.' }, { status: 500 });
    }
}