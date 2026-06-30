import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const { id } = await context.params;

    const leaveId = Number(id);

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

    const existing = await prisma.leaveRequest.findUnique({
      where: {
        id: leaveId,
      },
    });

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
