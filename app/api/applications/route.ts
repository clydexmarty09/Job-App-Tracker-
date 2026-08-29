/*
Dashboard request-> API route receives request->Extracy userId-> Validate->Query database-> Return applications-> and dashboard renders
*/
import { db } from "@/lib/db";
import { getLoggedInUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // get url from the request
    const { searchParams } = new URL(request.url); // gert URL, conver into string object, and the destructure

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    // get page from ?page
    const pageParam = searchParams.get("page");

    //convert to Number - default to 1
    //const page = Number(pageParam) || 1;

    // rows per page
    const limit = Number(limitParam) || 10;
    const offset = Number(offsetParam) || 0;

    // rows to skip
    // const offset = (page - 1) * limit;

    // read userID from query params
    // check if userID exists

    const userId = await getLoggedInUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }
    // query the database
    // add placegholder to prevent INJECTION attacks
    // DESC = newest first
    // ASC = oldeest first
    const result = await db.query(
      `SELECT id, company, position, pay, status, created_at, location
            FROM applications
            WHERE user_id = $1
            ORDER BY created_at DESC, id DESC
            LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
    // return the applications
    //return NextResponse.json(result.rows);

    // get total number of applications for this user
    const countRes = await db.query(
      `SELECT COUNT(*) AS total
      FROM applications
      WHERE user_id = $1`,
      [userId],
    );

    const totalCount = Number(countRes.rows[0].total);
    const totalPages = Math.ceil(totalCount / limit);

    // check how applications are in each status
    const statusCountRes = await db.query(
      `SELECT status, COUNT(*) as total
      FROM applications
      WHERE user_id = $1
      GROUP BY status`,
      [userId],
    );

    // create a predictable object for the frontend
    const statusCounts = {
      Applied: 0,
      Interviewed: 0,
      Offer: 0,
      Rejected: 0,
    };

    // loop through every grouped result in the database
    for (const row of statusCountRes.rows) {
      if (row.status in statusCounts) {
        statusCounts[row.status as keyof typeof statusCounts] = Number(
          row.total,
        ); // updates the object
      }
    }

    // return page data and pagination info
    return NextResponse.json({
      applications: result.rows,
      limit,
      offset,
      totalCount,
      statusCounts,
      hasMore: offset + result.rows.length < totalCount,
    });
  } catch (error) {
    console.error("Fetch applications error", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getLoggedInUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { company, pay, status, position, location } = body;
    const id = crypto.randomUUID();

    await db.query(
      `INSERT INTO applications(id, user_id, company, position, pay, status, location)
      VALUES ($1,$2,$3,$4,$5,$6, $7)`,
      [id, userId, company, position, pay, status, location],
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Cannot insert data" }, { status: 500 });
  }
}
