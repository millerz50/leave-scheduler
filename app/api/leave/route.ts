import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  getWorkingDays,
  hasOverlap,
  checkTeamCapacity,
} from "@/lib/leaveRules";

// =====================================
// GET ALL LEAVE REQUESTS FROM  EMPLOYEES
// =====================================

export async function GET() {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: {
        employee: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load leave requests",
      },

      {
        status: 500,
      },
    );
  }
}

// =====================================
// SUBMIT LEAVE REQUEST
// =====================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { employeeId, startDate, endDate } = body;

    if (!employeeId || !startDate || !endDate) {
      return NextResponse.json(
        {
          message: "Employee, start date and end date are required.",
        },

        {
          status: 400,
        },
      );
    }

    const requestedStart = new Date(startDate);

    const requestedEnd = new Date(endDate);

    if (requestedEnd < requestedStart) {
      return NextResponse.json(
        {
          message: "End date cannot be before start date.",
        },

        {
          status: 400,
        },
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        id: Number(employeeId),
      },
    });

    if (!employee) {
      return NextResponse.json(
        {
          message: "Employee not found.",
        },

        {
          status: 404,
        },
      );
    }

    // ===============================
    // DUPLICATE REQUEST CHECK
    // ===============================

    const duplicate = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: Number(employeeId),

        startDate: requestedStart,

        endDate: requestedEnd,

        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          message:
            "A leave request for these dates has already been submitted.",

          existingRequest: {
            id: duplicate.id,

            status: duplicate.status,
          },
        },

        {
          status: 400,
        },
      );
    }

    // ===============================
    // OVERLAP CHECK
    // ===============================

    const existing = await prisma.leaveRequest.findMany({
      where: {
        employeeId: Number(employeeId),
      },
    });

    const overlap = hasOverlap(
      {
        employeeId: Number(employeeId),

        startDate: requestedStart,

        endDate: requestedEnd,
      },

      existing,
    );

    if (overlap) {
      return NextResponse.json(
        {
          message: "Leave overlaps an existing approved leave request.",
        },

        {
          status: 400,
        },
      );
    }

    // ===============================
    // WORKING DAYS
    // ===============================

    const holidays = await prisma.holiday.findMany();

    const workingDays = getWorkingDays(
      requestedStart,

      requestedEnd,

      holidays.map((holiday) => holiday.date),
    );

    if (workingDays.length === 0) {
      return NextResponse.json(
        {
          message: "Selected dates contain no working days.",
        },

        {
          status: 400,
        },
      );
    }

    // ===============================
    // TEAM CAPACITY RULE
    // ===============================

    const employees = await prisma.employee.findMany();

    const approvedLeaves = await prisma.leaveRequest.findMany({
      where: {
        status: "APPROVED",
      },
    });

    const capacity = checkTeamCapacity(
      employee,

      workingDays,

      employees,

      approvedLeaves,
    );

    if (!capacity.allowed) {
      return NextResponse.json(
        {
          message: capacity.reason,

          details: capacity.details,
        },

        {
          status: 400,
        },
      );
    }

    // ===============================
    // CREATE REQUEST
    // ===============================

    const leave = await prisma.leaveRequest.create({
      data: {
        employeeId: Number(employeeId),

        startDate: requestedStart,

        endDate: requestedEnd,

        status: "PENDING",
      },
    });

    return NextResponse.json(
      {
        message: "Leave request submitted successfully.",

        leave,
      },

      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Something went wrong while submitting leave request.",
      },

      {
        status: 500,
      },
    );
  }
}
