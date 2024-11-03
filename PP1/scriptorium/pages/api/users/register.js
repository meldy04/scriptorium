import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "@/utils/db";

export default async function handler(req, res) {
    try {
        const { email, password, firstName, lastName, avatar, phone } = req.body;

        // Check if the email already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
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

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
        return res.status(201).json({ message: "User registered successfully", user, token });

    } catch (error) {
        res.status(500).json({ error: "An unexpected error occurred while registering the user" });
    }
}
