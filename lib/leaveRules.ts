import { LeaveStatus } from "@prisma/client";

type LeaveRequest = {
  employeeId: number;
  startDate: Date;
  endDate: Date;
};

type ExistingLeave = {
  employeeId: number;
  startDate: Date;
  endDate: Date;
  status: LeaveStatus;
};

type Employee = {
  id: number;
  name: string;
  team: string;
};

type CapacityResult = {
  allowed: boolean;
  reason: string;
  details?: {
    date: Date;
    currentCount: number;
    maximum: number;
    employees: string[];
  };
};

function isWeekend(date: Date) {
  const day = date.getDay();

  return day === 0 || day === 6;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getWorkingDays(
  start: Date,
  end: Date,
  holidays: Date[],
): Date[] {
  const days: Date[] = [];

  const current = new Date(start);

  while (current <= end) {
    const isHoliday = holidays.some((holiday) => sameDay(holiday, current));

    if (!isWeekend(current) && !isHoliday) {
      days.push(new Date(current));
    }

    current.setDate(current.getDate() + 1);
  }

  return days;
}

export function hasOverlap(
  request: LeaveRequest,
  existing: ExistingLeave[],
): boolean {
  return existing.some((leave) => {
    if (leave.employeeId !== request.employeeId) {
      return false;
    }

    /*
        Business decision:
        Only approved leave blocks
        of new request.
      */

    if (leave.status !== LeaveStatus.APPROVED) {
      return false;
    }

    return (
      request.startDate <= leave.endDate && request.endDate >= leave.startDate
    );
  });
}

export function checkTeamCapacity(
  employee: Employee,

  requestDays: Date[],

  employees: Employee[],

  approvedLeaves: ExistingLeave[],
): CapacityResult {
  const teamMembers = employees.filter(
    (member) => member.team === employee.team,
  );

  /*
   

  */

  const maxAllowed = Math.ceil(teamMembers.length * 0.3);

  console.log("==============================");

  console.log("TEAM CAPACITY CHECK");

  console.log("Team:", employee.team);

  console.log("Team size:", teamMembers.length);

  console.log("Maximum allowed:", maxAllowed);

  console.log("==============================");

  for (const day of requestDays) {
    let count = 0;

    const peopleOnLeave: string[] = [];

    approvedLeaves.forEach((leave) => {
      if (leave.status !== LeaveStatus.APPROVED) {
        return;
      }

      const isAway = leave.startDate <= day && leave.endDate >= day;

      if (isAway) {
        const person = employees.find(
          (employee) => employee.id === leave.employeeId,
        );

        if (person && person.team === employee.team) {
          count++;

          peopleOnLeave.push(person.name);
        }
      }
    });

    console.log({
      checkingDate: day.toDateString(),

      employeesAlreadyAway: count,

      maximumAllowed: maxAllowed,

      peopleOnLeave,
    });

    if (count >= maxAllowed) {
      return {
        allowed: false,

        reason: `Leave cannot be approved on ${day.toDateString()}. ${count} ${employee.team} employees are already away. Maximum allowed is ${maxAllowed}.`,

        details: {
          date: day,

          currentCount: count,

          maximum: maxAllowed,

          employees: peopleOnLeave,
        },
      };
    }
  }

  return {
    allowed: true,

    reason: "Team capacity available",
  };
}
