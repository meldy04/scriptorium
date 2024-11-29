import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/utils/db";
import { auth } from "@/utils/auth";

interface UserProfileUpdateRequest {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    phone?: string;
}

export const PUT = async (req: NextRequest) => {
    try {
        const authResult = await auth(req);
        const { user } = authResult;

        if (!user) {
            return new NextResponse('Denied - you must be logged in to edit your profile', { status: 403 });
        }

        const {
            firstName, lastName, avatar, phone
        }: UserProfileUpdateRequest = await req.json();

        try {
            const updatedUser = await prisma.user.update({
                where: { id: Number(user.userId) },
                data: { firstName, lastName, avatar, phone },
            });

            // Return updated user as response
            return new NextResponse(JSON.stringify(updatedUser), { status: 200 });
        } catch {
            return new NextResponse('Profile update failed', { status: 400 });
        }
    } catch (error) {
        if (error instanceof Error) {
            return new NextResponse(error.message, { status: 401 });
        } else {
            return new NextResponse('An unknown error occurred', { status: 500 });
        }
    }
};
