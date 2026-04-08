import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// we use POST because logout changes data
export async function POST() {
  try {
    //const body = await request.json();
    const cookieStore = await cookies(); // get access to request cookies
    const sessionId = (await cookieStore).get("sessionId")?.value; // reads session cookie - looks for cookie called sessionId

    // if there is a session, delete that session
    if (sessionId) {
      await db.query(
        `DELETE from sessions
        WHERE id = $1`, // helps protect agains SQL injection
        [sessionId],
      );
    }

    const response = NextResponse.json({ message: "Logged out succesfully " });

    // clear the cookie in the browser
    response.cookies.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // browser removes old expired date
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
