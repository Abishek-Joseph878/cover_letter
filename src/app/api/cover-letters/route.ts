import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";

/**
 * GET /api/cover-letters
 * Retrieves all cover letters from the database, sorted by creation date.
 */
export async function GET() {
  try {
    await connectDB();
    const coverLetters = await CoverLetter.find().sort({ createdAt: -1 });
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
 * Creates a new cover letter in the database.
 */
export async function POST(request: Request) {
  try {
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

    const newCoverLetter = await CoverLetter.create(body);
    return NextResponse.json({ success: true, data: newCoverLetter }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create cover letter" },
      { status: 500 }
    );
  }
}
