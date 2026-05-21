/*
this file reads a session cookie, finds the logged in user, and only modify rows the belong to user

*/
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

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
    const deleteResult = await db.query(
      `DELETE FROM applications
            WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );

    // checks if the delete actually affected anything
    if (deleteResult.rowCount === 0) {
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

    if (!userId) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const updates: string[] = []; // array of strings - start as an empty array
    const values: (string | number | null)[] = [];

    // check whether status was sent
    if ("status" in body) {
      values.push(body.status ?? null);
      updates.push(`status = $${values.length}`);
    }

    if ("pay" in body) {
      values.push(body.pay ?? null);
      updates.push(`pay = $${values.length}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No field selected" }, { status: 400 });
    }

    values.push(id);
    const idPlaceholder = `$${values.length}`;

    values.push(userId);
    const userIdPlaceholder = `$${values.length}`;
    // const { status, pay } = body;

    // if (!userId) {
    //   return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    // }

    // takes the array and combine it into one
    const res = await db.query(
      `UPDATE applications
            SET ${updates.join(", ")}  
            WHERE id = ${idPlaceholder}
            AND user_id = ${userIdPlaceholder}`,
      values,
    );

    if (res.rowCount === 0) {
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
