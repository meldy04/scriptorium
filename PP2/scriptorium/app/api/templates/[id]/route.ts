import prisma from "@/utils/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/utils/auth";

export async function GET(request: NextRequest) {
  const authResult = auth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const url = new URL(request.url);
    const { pathname } = url;
    const id = pathname.split('/').pop();

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    const template = await prisma.template.findUnique({
      where: { id: parseInt(id) },
    });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template, { status: 200 });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Failed to fetch template', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = auth(request);

  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {
    const url = new URL(request.url);
    const { pathname } = url;
    const id = pathname.split('/').pop();

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid template ID' }, { status: 400 });
    }

    const { title, explanation, tags, code, language } = await request.json();

    const updatedTemplate = await prisma.template.update({
      where: { id: parseInt(id) },
      data: {
        title,
        explanation,
        tags,
        code,
        language,
      },
    });

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
  }
}