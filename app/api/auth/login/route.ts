import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

/*
We need this because TS complains that it does not know what rows is an array 
or a row of objects on line 37
this is because db.execute can return different kinds of results depending on the query 

Defines the shape of one user row 
So this tells TS "for this specific query, rows is an arrayof user rows"
*/
type UserRow = RowDataPacket & {
  id: string;
  email: string;
  password_hash: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 },
      );
    }

    const [rows] = await db.execute<UserRow[]>(
      `SELECT id, email, password_hash
      FROM users
      WHERE email = ?
      LIMIT 1`,
      [email],
    );

    const user = rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 },
      );
    }

    const pw_match = await bcrypt.compare(password, user.password_hash);

    if (!pw_match) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
