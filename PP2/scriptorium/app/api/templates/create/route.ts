import prisma from "../../../../utils/db";
import { auth } from "@/utils/auth";
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  const authResult = auth(req);

  if (authResult.error) {
    return authResult.response;
  }

  const { user } = authResult;

  if (!user) {
    return NextResponse.json(
        { error: 'Denied - please login to create a template' },
        { status: 403 }
    );
  }

  const { title, explanation, tags, code, language, isForked } = await req.json();

  try {
    const template = await prisma.template.create({
      data: {
        title,
        explanation,
        tags: isForked ? `${tags},forked` : tags,
        code,
        language,
        isForked,
        user: { connect: { id: user.userId } },
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
          { error: 'Failed to create template', details: error.message },
          { status: 400 }
      );
    }
    return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 400 }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const authResult = auth(req);

  if (authResult.error) {
    return authResult.response;
  }

  const { user } = authResult;

  if (!user) {
    return NextResponse.json(
        { error: 'Denied - please login to update the template' },
        { status: 403 }
    );
  }

  try {
    const templateId = req.nextUrl.searchParams.get('id');
    if (!templateId) {
      return NextResponse.json(
          { error: 'Template ID is required' },
          { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: { id: parseInt(templateId) },
    });

    if (!template || template.userID !== user.userId) {
      return NextResponse.json(
          { error: 'Template not found or unauthorized' },
          { status: 404 }
      );
    }

    // Toggle isPublic field
    const updatedTemplate = await prisma.template.update({
      where: { id: parseInt(templateId) },
      data: {
        isPublic: !template.isPublic,
      },
    });

    return NextResponse.json(updatedTemplate, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
          { error: 'Failed to create template', details: error.message },
          { status: 400 }
      );
    }
    return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 400 }
    );
  }
};