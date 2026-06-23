import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import CoverLetter from "@/models/CoverLetter";

/**
 * GET /api/cover-letters/[id]
 * Retrieves a single cover letter by ID.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: coverLetter }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve cover letter" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cover-letters/[id]
 * Updates a cover letter by ID.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const updatedCoverLetter = await CoverLetter.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCoverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCoverLetter }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update cover letter" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cover-letters/[id]
 * Deletes a cover letter by ID.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const deletedCoverLetter = await CoverLetter.findByIdAndDelete(id);
    if (!deletedCoverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Cover letter deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete cover letter" },
      { status: 500 }
    );
  }
}
