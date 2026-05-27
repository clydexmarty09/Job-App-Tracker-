import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";

function isValidPassword(pw: string) {
  if (pw.length < 8) {
    return "Password must be at least 8 characters long!";
  }

  if (!/[a-z]/.test(pw)) {
    return "Password must contain at least one lowercase letter!";
  }
  if (!/[A-Z]/.test(pw)) {
    return "Password must contain at least one uppercase letter!";
  }

  if (!/[0-9]/.test(pw)) {
    return "Password must contain at least one number!";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password required!" },
        { status: 400 },
      );
    }
    const badPassWord = isValidPassword(password);

    if (badPassWord) {
      return NextResponse.json({ error: badPassWord }, { status: 400 });
    }
  } catch {
    return NextResponse.json(
      { error: "Cannot update password" },
      { status: 500 },
    );
  }
}
