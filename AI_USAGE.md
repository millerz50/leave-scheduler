# AI Usage

## AI Tools Used

- ChatGPT (OpenAI)

## How AI Was Used

AI was used as a development assistant throughout the project. It helped with:

- Explaining business rules and edge cases.
- Generating boilerplate code for API routes and React components.
- Reviewing and improving TypeScript code.
- Suggesting project structure and file organization.
- Improving API responses and error handling.
- Writing project documentation (README and DECISIONS).

All generated code was reviewed, tested, and modified before being committed to the repository.

---

## Most Useful Prompt 1

> Explain how to implement the 30% team leave rule in a maintainable way using TypeScript and Prisma, including handling weekends, public holidays, and multi-day leave requests.

### Why it was useful

This helped separate the business rules from the API layer by implementing reusable validation functions that could also be unit tested.

---

## Most Useful Prompt 2

> Review my Next.js API route and improve validation, error handling, and response messages without changing the overall architecture.

### Why it was useful

The suggestions improved the readability of the API endpoints and resulted in clearer error responses for invalid leave requests and approval actions.

---

## One Case Where AI Was Wrong

During development, AI suggested Prisma configuration that was incompatible with the latest Prisma 7 changes regarding datasource configuration and client initialization. This resulted in initialization errors.

The issue was identified through testing and by consulting the Prisma documentation. The implementation was then updated to use the correct Prisma 7 configuration.

---

## Reflection

AI accelerated repetitive development tasks and documentation but did not replace manual decision-making. Business rules, implementation choices, debugging, testing, and final code review were completed by me before submission.
