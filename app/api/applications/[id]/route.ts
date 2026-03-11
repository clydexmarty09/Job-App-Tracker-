import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// DELETE route expects requests like DELETE /api/applications/abc123
export async function DELETE(
  request: Request,
  context: {
    params: { id: string };
  },
) {
  try {
    const { id } = context.params;

    await db.execute(
      `DELETE FROM applications
            WHERE id = ?`,
      [id],
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot delete data" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = context.params;
    const body = await request.json();
    const { status } = body;

    await db.execute(
      `UPDATE applications
            SET status = ?
            WHERE id = ?`,
      [status, id],
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot updated data" }, { status: 500 });
  }
}
