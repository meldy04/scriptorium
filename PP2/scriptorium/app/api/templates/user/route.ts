import prisma from "@/utils/db";
import { auth } from "@/utils/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const authResult = auth(req);

    if (authResult.error) {
        return authResult.response;
    }

    const { user } = authResult;
    if (!user) {
        return authResult.response;
    }

    try {
        const userTemplates = await prisma.template.findMany({
            where: {
                userID: user.userId,
            },
            select: {
                id: true,
                title: true,
                explanation: true,
                tags: true
            },
        });

        return new Response(JSON.stringify(userTemplates), { status: 200 });
    } catch (error: unknown) {
        console.error('Error fetching user templates:', (error as Error).message || error);
        return new Response(JSON.stringify({ error: 'Failed to fetch templates' }), { status: 500 });
    }
}