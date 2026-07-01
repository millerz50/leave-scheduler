# Team Leave Scheduler

A simple internal HR application for viewing team leave, submitting leave requests, and approving or rejecting pending requests.

## Tech Stack

- Next.js 16
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Jest/Vitest (Unit Testing)

---

## Clone the Repository

```bash
git clone https://github.com/millerz50/leave-scheduler.git
```

Navigate into the project.

```bash
cd leave-scheduler
```

Install project dependencies.

```bash
npm install
```

---

## Configure Environment

Create a `.env` file in the project root if one does not already exist.

```env
DATABASE_URL="file:./dev.db"
```

---

## Set Up the Database

Generate the Prisma Client.

```bash
npx prisma generate
```

Apply the database migrations.

```bash
npx prisma migrate dev
```

Seed the database with sample employees, holidays, and leave requests.

```bash
npm run seed
```

---

## Run the Application

Start the development server.

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## Run the Tests

```bash
npm test
```

or

```bash
npm run test
```

---

## Features

- View approved leave for the next 30 days
- Submit new leave requests
- View pending leave requests
- Approve or reject pending requests
- Prevent duplicate leave submissions
- Prevent overlapping approved leave requests
- Enforce the 30% team leave capacity rule
- Exclude weekends from leave calculations
- Exclude public holidays from leave calculations
- Seed database with sample employees and public holidays
