import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import connectDB from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";
import { verifyJWT } from "@/lib/auth";

// Helper to authenticate requests and get payload
async function getAuthSession() {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;

  if (!token) {
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;
  return await verifyJWT(token);
}

/**
 * GET /api/cover-letters
 * Retrieves cover letters belonging to the logged-in user.
 */
export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const coverLetters = await CoverLetter.find({ userId: session.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ success: true, data: coverLetters }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve cover letters" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cover-letters
 * Creates a new cover letter associated with the logged-in user.
 */
export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.jobTitle || !body.company || !body.generatedContent) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, jobTitle, company, or generatedContent",
        },
        { status: 400 }
      );
    }

    // Attach user ID
    const newCoverLetter = await CoverLetter.create({
      ...body,
      userId: session.userId,
    });

    return NextResponse.json({ success: true, data: newCoverLetter }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create cover letter" },
      { status: 500 }
    );
  }
}
