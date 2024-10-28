import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "@/utils/db";

export default async function handler(req, res) {
    const { email, password, firstName, lastName, avatar, phone } = req.body;

    const hashedPassword  = await bcrypt.hash(password, 10);
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

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
}