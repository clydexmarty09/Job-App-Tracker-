// This file creates a backend API route for POST /api/register
// reads the data, checks if emails and passwords exists, hashes pw, stores new user in db, sends back a response

import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body; // destructuring: pulls email and pw out of body
    const uid = crypto.randomUUID();
    const pw_hash = await bcrypt.hash(password, 10);
    //const created_at = Date.now() not needed because SQL table already has it

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    await db.execute(
      `INSERT INTO users(id, email, password_hash)
        VALUE (?, ?, ?)`,
      [uid, email, pw_hash],
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
