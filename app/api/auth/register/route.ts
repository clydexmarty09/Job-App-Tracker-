// This file creates a backend API route for POST /api/register
// reads the data, checks if emails and passwords exists, hashes pw, stores new user in db, sends back a response

import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

type UserRow = RowDataPacket & {
  email: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; // destructuring: pulls email and pw out of body
    const uid = crypto.randomUUID();

    // validation check if user exists?
    const [rows] = await db.execute<UserRow[]>(
      `SELECT email
      FROM users
      WHERE email = ?
      LIMIT 1`,
      [email],
    );

    if (rows.length > 0) {
      return NextResponse.json(
        {
          error: "User already exists!",
        },
        { status: 409 }, // 409 is code for conflict ( resource alread exists )
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const pw_hash = await bcrypt.hash(password, 10);
    //const created_at = Date.now() not needed because SQL table already has it

    await db.execute(
      `INSERT INTO users(id, email, password_hash)
        VALUES (?, ?, ?)`,
      [uid, email, pw_hash],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("REGISTRATION ERROR", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
