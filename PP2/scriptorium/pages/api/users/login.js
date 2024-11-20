import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from "@/utils/db";

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const comparePassword = async (inputPassword, storedPassword) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

export default async function handler(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all the required fields" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials"});
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    return res.status(200).json({ token });
  } catch {
    res.status(500).json({ error: "An unexpected error occured while logging in" });
  }
}