import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/utils/db';
import { comparePassword } from '@/utils/auth';
import { generateToken } from '@/utils/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password }: { email: string; password: string } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Please provide all the required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ token, user: { id: user.id, email: user.email } }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred while logging in" }, { status: 500 });
  }
}
