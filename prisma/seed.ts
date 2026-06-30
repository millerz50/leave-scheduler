import "dotenv/config";
import { PrismaClient, LeaveStatus } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.leaveRequest.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.holiday.deleteMany();

  const employees = [
    {
      name: "John Smith",
      team: "Engineering",
    },

    {
      name: "Sarah Wilson",
      team: "Engineering",
    },

    {
      name: "Mike Brown",
      team: "Engineering",
    },

    {
      name: "Linda Jones",
      team: "Operations",
    },

    {
      name: "James White",
      team: "Operations",
    },

    {
      name: "Faith Moyo",
      team: "Operations",
    },

    {
      name: "David Smith",
      team: "Finance",
    },

    {
      name: "Alice Green",
      team: "Finance",
    },

    {
      name: "Kevin Black",
      team: "Finance",
    },
  ];

  await prisma.employee.createMany({
    data: employees,
  });

  await prisma.holiday.createMany({
    data: [
      {
        date: new Date("2026-07-10"),
        name: "Public Holiday",
      },

      {
        date: new Date("2026-08-11"),
        name: "National Holiday",
      },
    ],
  });

  const john = await prisma.employee.findFirst({
    where: {
      name: "John Smith",
    },
  });

  if (john) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: john.id,

        startDate: new Date("2026-07-03"),

        endDate: new Date("2026-07-05"),

        status: LeaveStatus.APPROVED,
      },
    });
  }
}

main()
  .then(() => {
    console.log("Database seeded");
  })
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
