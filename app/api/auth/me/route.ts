/*
This file determines the current logged in user byt reading the session cookie and checking the db
*/

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";

// the shape of the row returned from the sessions table query
type SessionRow = RowDataPacket & {
  user_id: string;
};

export async function GET() {
  try {
    const cookieStore = await cookies(); // get all cookies
    const sessionId = (await cookieStore).get("sessionId")?.value; // look for one cookie names sessionId

    if (!sessionId) {
      // throw an error if user is not logged in
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    // return an array of SessionRow objects
    const [rows] = await db.execute<SessionRow[]>( // find sessions whose id matches the cookie
      // only return if the expiration is still in the future
      `SELECT user_id FROM sessions WHERE id = ?
      AND expires_at > NOW()  
      LIMIT 1`,
      [sessionId],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid Sessions" }, { status: 401 });
    }
    const userId = rows[0].user_id;

    return NextResponse.json({
      user: {
        id: userId,
      },
    });
  } catch (error) {
    console.error("AUTH /ME ERROR:", error);
    return NextResponse.json(
      { error: "Failed to check auth" },
      { status: 500 },
    );
  }
}
