import prisma from "@/utils/db";
import { comparePassword, generateToken } from "@/utils/auth";

export default async function handler(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Please provide all the required fields",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = generateToken({ userId: user.id, username: user.username });

  return res.status(200).json({
    token,
  });
}