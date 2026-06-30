import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/*
  Approves a pending leave request.

  Workflow:
  1. Validate the leave request ID.
  2. Check that the request exists.
  3. Ensure only pending requests can be approved.
  4. Update the status to APPROVED.
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
    // Extract the dynamic route parameter.
    const { id } = await context.params;

    const leaveId = Number(id);

    // Ensure the ID provided is a valid number.
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

    // Retrieve the leave request from the database.
    const existing = await prisma.leaveRequest.findUnique({
      where: {
        id: leaveId,
      },
    });

    // Return 404 if the request does not exist.
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
      Only pending requests can be approved.

      This prevents:
      - approving an already approved request
      - approving a rejected request
    */
    if (existing.status !== "PENDING") {
      return NextResponse.json(
        {
          message: "Only pending requests can be approved.",
        },
        {
          status: 400,
        },
      );
    }

    // Update the request status.
    const leave = await prisma.leaveRequest.update({
      where: {
        id: leaveId,
      },
      data: {
        status: "APPROVED",
      },
    });

    return NextResponse.json({
      message: "Leave request approved successfully",
      leave,
    });
  } catch (error) {
    // Log unexpected server errors for debugging.
    console.error("APPROVE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to approve leave request",
      },
      {
        status: 500,
      },
    );
  }
}
