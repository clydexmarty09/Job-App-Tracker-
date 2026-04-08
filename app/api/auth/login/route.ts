import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
//import type { RowDataPacket } from "mysql2";

/*
We need this because TS complains that it does not know what rows is an array 
or a row of objects on line 37
this is because db.execute can return different kinds of results depending on the query 

Defines the shape of one user row 
So this tells TS "for this specific query, rows is an arrayof user rows"
*/
// type UserRow = RowDataPacket & {
//   id: string;
//   email: string;
//   password_hash: string;
// };

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

    const userExists = await db.query(
      `SELECT id, email, password_hash
      FROM users
      WHERE email = $1
      LIMIT 1`,
      [email],
    );

    const user = userExists.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 },
      );
    }

    const pw_match = await bcrypt.compare(password, user.password_hash);

    if (!pw_match) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 },
      );
    }

    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24); // current time + 24 hours : 1000ms  * 60 sec * 60 min * 24 hour // creates session that lasts one day
    const sessionId = crypto.randomUUID(); // make a unique id for the session

    // insert into sessions table
    await db.query(
      `INSERT INTO sessions (id, user_id, expires_at)
      VALUES (?,?,?)`,
      [sessionId, user.id, expires_at],
    );

    // return NextResponse.json({
    //   ok: true,
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //   },
    // });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    // set the cookie
    response.cookies.set("sessionId", sessionId, {
      httpOnly: true, // frontend JS cannot read the cookie with document.cookie
      path: "/", // make cookie available across app
      sameSite: "lax", // give some CSRF protection
      secure: process.env.NODE_ENV === "production", // cookie on sent over HTTPS
      expires: expires_at,
    });

    //console.log("DB_NAME:", process.env.DB_NAME);
    return response;
  } catch (error) {
    //console.log("DB_NAME:", process.env.DB_NAME);
    console.error("LOGIN ROUTE ERROR:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
