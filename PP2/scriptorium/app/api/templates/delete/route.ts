import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/db";
import { auth } from "@/utils/auth";

export async function DELETE(req: NextRequest) {
    const authResult = auth(req);

    if (authResult instanceof NextResponse) {
        return authResult;
    }

    if (!authResult.user) {
        return NextResponse.json(
            { error: 'Unauthorized access or missing user information' },
            { status: 401 }
        );
    }

    try {
        const idString = req.nextUrl.searchParams.get('id');
        if (!idString || isNaN(parseInt(idString))) {
            return NextResponse.json({ error: 'Invalid or missing Template ID' }, { status: 400 });
        }

        const id = parseInt(idString);
        const userId = authResult.user.userId;

        const template = await prisma.template.findFirst({
            where: { id, userID: userId },
        });

        if (!template) {
            return NextResponse.json({ error: 'Template not found or not authorized' }, { status: 404 });
        }

        await prisma.template.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Template successfully deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting template:', error);
        return NextResponse.json({ error: 'Failed to delete template', details: (error instanceof Error) ? error.message : 'Unknown error' }, { status: 500 });
    }
}