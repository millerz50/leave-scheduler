import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
  Rejects a pending leave request.

  Workflow:
  1. Validate the leave request ID.
  2. Check that the request exists.
  3. Ensure only pending requests can be rejected.
  4. Update the status to REJECTED.
*/
export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    // Extract the leave request ID from the route.
    const { id } = await context.params;

    const leaveId = Number(id);

    // Ensure a valid numeric ID was provided.
    if (isNaN(leaveId)) {
      return NextResponse.json(
        {
          message: "Invalid leave ID",
        },
        {
          status: 400,
        },
      );
    }

    // Find the leave request in the database.
    const existing = await prisma.leaveRequest.findUnique({
      where: {
        id: leaveId,
      },
    });

    // Return 404 if the request cannot be found.
    if (!existing) {
      return NextResponse.json(
        {
          message: "Leave request not found",
        },
        {
          status: 404,
        },
      );
    }

    /*
      Only pending requests can be rejected.

      This prevents:
      - rejecting an already approved request
      - rejecting an already rejected request
    */
    if (existing.status !== "PENDING") {
      return NextResponse.json(
        {
          message: "Only pending requests can be rejected.",
        },
        {
          status: 400,
        },
      );
    }

    // Update the leave request status to REJECTED.
    const leave = await prisma.leaveRequest.update({
      where: {
        id: leaveId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json({
      message: "Leave request rejected successfully",
      leave,
    });
  } catch (error) {
    // Log unexpected server errors for debugging.
    console.error("REJECT ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to reject leave request",
      },
      {
        status: 500,
      },
    );
  }
}
