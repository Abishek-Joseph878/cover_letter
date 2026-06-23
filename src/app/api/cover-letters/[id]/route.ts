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
 * GET /api/cover-letters/[id]
 * Retrieves a single cover letter by ID, verifying user ownership.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this cover letter." },
        { status: 403 }
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
 * Updates a cover letter by ID, verifying user ownership.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this cover letter." },
        { status: 403 }
      );
    }

    const updatedCoverLetter = await CoverLetter.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

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
 * Deletes a cover letter by ID, verifying user ownership.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const coverLetter = await CoverLetter.findById(id);
    if (!coverLetter) {
      return NextResponse.json(
        { success: false, error: "Cover letter not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (coverLetter.userId.toString() !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Access denied. You do not own this cover letter." },
        { status: 403 }
      );
    }

    await CoverLetter.findByIdAndDelete(id);

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
