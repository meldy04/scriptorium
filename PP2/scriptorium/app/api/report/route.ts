import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/db";
import { auth } from '@/utils/auth';

export async function POST(req: NextRequest) {
  const authResult = auth(req);

  if (authResult instanceof NextResponse) {
    console.log("Authentication failed.");
    return authResult;
  }

  const { user } = authResult;

  try {
    const body = await req.json();
    const { explanation, userId, blogPostId, commentId } = body;

    console.log("Received data:", { explanation, userId, blogPostId, commentId });

    if (!user || userId !== user.userId) {
      return NextResponse.json({ error: 'User ID mismatch or user not authenticated' }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        explanation,
        userId: user.userId,
        blogPostId,
        commentId,
      },
    });

    if(blogPostId) {
      await prisma.blogPost.update({
        where: { id: blogPostId },
        data: { reportCount: { increment: 1 } },
      });
    }

    if (commentId) {
      await prisma.comment.update({
        where: { id: commentId },
        data: { reportCount: { increment: 1 } },
      });
    }

    console.log("Report created:", report);
    return NextResponse.json(report, { status: 201 });

  } catch (error) {
    console.log("Something went wrong in report creation", error);
    return NextResponse.json({ error: 'Failed to create report' }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}