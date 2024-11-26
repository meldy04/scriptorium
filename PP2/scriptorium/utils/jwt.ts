import jwt from 'jsonwebtoken';

interface GenerateTokenPayload {
    userId: number;
    email: string;
    role: string;
}

export const generateToken = (payload: GenerateTokenPayload): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};
