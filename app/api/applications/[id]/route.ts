/*
this file reads a session cookie, finds the logged in user, and only modify rows the belong to user

*/
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

type SessionRow = RowDataPacket & {
  user_id: string;
};

// reads session cookie, looks up session in db, return logged in user's id
// async function getLoggedInUserId() {
//   const cookieStore = await cookies(); // a collection of cookeis :)
//   const sessionId = cookieStore.get("sessionId")?.value; // finds a cookie names session id and get its value, else return undefined

//   if (!sessionId) {
//     return null;
//   }

//   // database lookup
//   const [sessionRows] = await db.execute<SessionRow[]>(
//     `SELECT user_id
//     FROM sessions
//     WHERE id = ?`,
//     [sessionId],
//   );

//   if (sessionRows.length === 0) {
//     return null;
//   }

//   return sessionRows[0].user_id; // if session row was found, returns user id from first row
// }

// DELETE route expects requests like DELETE /api/applications/abc123
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;
    const userId = await getLoggedInUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 }); // 401 means unauthorized
    }

    // delete the row only if the application id mathes, and the row belongs to the logged-in user
    // DELTE query does not return rows like a SELECT, so we add ResulrSetHeader to TS understands result.affectRows
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM applications
            WHERE id = ? AND user_id = ?`,
      [id, userId],
    );

    // checks if the delete actually affected anything
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete data" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getLoggedInUserId();
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!userId) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE applications
            SET status = ?
            WHERE id = ?
            AND user_id = ?`,
      [status, id, userId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot update data" }, { status: 500 });
  }
}
