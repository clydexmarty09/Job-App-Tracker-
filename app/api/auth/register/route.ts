// This file creates a backend API route for POST /api/register
// reads the data, checks if emails and passwords exists, hashes pw, stores new user in db, sends back a response

import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

// type UserRow = RowDataPacket & {
//   email: string;
// };

function isValidEmail(email: string) {
  const trimmed = email.trim().toLowerCase();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function isValidPassword(pw: string) {
  if (pw.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (!/[a-z]/.test(pw)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[A-Z]/.test(pw)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[0-9]/.test(pw)) {
    return "Password must contain at least one number";
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; // destructuring: pulls email and pw out of body
    const uid = crypto.randomUUID();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // validation check if user exists?
    const userExists = await db.query(
      `SELECT email
      FROM users
      WHERE email = $1
      LIMIT 1`,
      [email],
    );

    if (userExists.rows.length > 0) {
      return NextResponse.json(
        {
          error: "User already exists!",
        },
        { status: 409 }, // 409 is code for conflict ( resource alread exists )
      );
    }

    const pw_hash = await bcrypt.hash(password, 10);
    //const created_at = Date.now() not needed because SQL table already has it

    await db.query(
      `INSERT INTO users(id, email, password_hash)
        VALUES ($1, $2, $3)`,
      [uid, email, pw_hash],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("REGISTRATION ERROR", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
