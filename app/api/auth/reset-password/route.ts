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

    const tokenResult = await db.query(
      `SELECT id, user_id, expires_at, used_at
      FROM password_reset_tokens
      WHERE token = $1
      LIMIT 1`,
      [token],
    );

    const resetToken = tokenResult.rows[0];

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 400 },
      );
    }

    if (resetToken.used_at) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 400 },
      );
    }

    const expiresAt = new Date(resetToken.expires_at);

    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired link" },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      `UPDATE users
      SET password_hash = $1
      WHERE id = $2`,
      [passwordHash, resetToken.user_id],
    );

    await db.query(
      `UPDATE password_reset_tokens
      SET used_at = NOW()
      where id = $1`,
      [resetToken.id],
    );

    return NextResponse.json({
      ok: true,
      message: "Password updated succesfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR", error);
    return NextResponse.json(
      { error: "Cannot update password" },
      { status: 500 },
    );
  }
}
