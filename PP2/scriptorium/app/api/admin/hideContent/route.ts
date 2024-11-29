import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { auth } from '@/utils/auth';

export async function PUT(req: NextRequest) {
  const { error, user } = auth(req);

  if (error || !user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, contentType, isHidden } = await req.json();

  if (!id || !contentType || typeof isHidden !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request data.' }, { status: 400 });
  }

  try {
    if (contentType === 'BlogPost') {
      await prisma.blogPost.update({
        where: { id },
        data: { isHidden },
      });
    } else if (contentType === 'Comment') {
      await prisma.comment.update({
        where: { id },
        data: { isHidden },
      });
    } else {
      return NextResponse.json({ error: 'Invalid content type.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating content visibility:', error);
    return NextResponse.json({ error: 'Error updating content.' }, { status: 500 });
  }
}