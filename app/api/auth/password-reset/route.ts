import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const normalizedEmail = email.trim().toLowerCase();

    const search = await db.query(
      `SELECT id FROM users
        WHERE email = $1`,
      [normalizedEmail],
    );

    if (search.rows.length === 0) {
      return NextResponse.json({
        message: "If user exists, an email will be sent.",
      });
    }

    const user = search.rows[0];

    if (user) {
      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      const resetTokenId = crypto.randomUUID();

      await db.query(
        `INSERT INTO password_reset_tokens(id, user_id, token, expires_at)
            VALUES ($1, $2, $3, $4)`,
        [resetTokenId, user.id, token, expiresAt],
      );

      const resetLink = `http://localhost:3000/reset-password?token=${token}`;

      console.log("Password reset link", resetLink);
    }

    return NextResponse.json({
      message: "If user exists, an email will be sent",
    });
  } catch {
    return NextResponse.json(
      { error: "Cannot submit request" },
      { status: 500 },
    );
  }
}
