import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function getLoggedInUserId() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return null;
    }

    const sessionRow = await db.query(
      `SELECT user_id
            FROM sessions
            WHERE id = $1 AND expires_at > NOW()`,
      [sessionId],
    );

    if (sessionRow.rows.length === 0) {
      return null;
    }

    return sessionRow.rows[0].user_id;
  } catch {
    return null; // placeholder
  }
}
