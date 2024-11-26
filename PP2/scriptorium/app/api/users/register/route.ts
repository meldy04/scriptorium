import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function POST(req: NextRequest) {
    try {
        const { email, password, firstName, lastName, avatar, phone } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                avatar,
                phone,
            },
        });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!);

        return NextResponse.json({ message: "User registered successfully", user, token }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An unexpected error occurred while registering the user" }, { status: 500 });
    }
}
