import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

interface DecodedToken {
    userId: number;
    email: string;
    role: string;
}

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export const auth = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return {
            error: true,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        };
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return {
            error: true,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        };
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        return { error: false, user: decoded };
    } catch (error) {
        console.error(error);
        return {
            error: true,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        };
    }
};