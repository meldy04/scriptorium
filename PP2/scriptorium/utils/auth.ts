import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {NextRequest} from "next/server";

interface DecodedToken {
    userId: number;
    email: string;
    role: string;
}

export const auth = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        throw new Error('Unauthorized');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Unauthorized');
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

        return { user: decoded };
    } catch (error) {
        console.error(error);
        throw new Error('Unauthorized');
    }
};

export const comparePassword = async (inputPassword: string, storedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(inputPassword, storedPassword);
};
