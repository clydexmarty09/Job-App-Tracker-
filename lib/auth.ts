import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { RowDataPacket } from "mysql2";

type SessionRow = RowDataPacket & {
  user_id: string;
};

export async function getLoggedInUserId() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return null;
    }

    const [sessionRows] = await db.execute<SessionRow[]>(
      `SELECT user_id
            FROM sessions
            WHERE id = ? AND expires_at > NOW()`,
      [sessionId],
    );

    if (sessionRows.length === 0) {
      return null;
    }

    return sessionRows[0].user_id;
  } catch {
    return null; // placeholder
  }
}
