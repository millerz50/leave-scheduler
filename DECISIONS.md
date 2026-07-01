# Design Decisions

## 1. Team Capacity Rule

### Decision

The 30% rule is evaluated per working day across the requested leave period.

### Alternatives Considered

- Validate only the first day.
- Validate only the start and end dates.

### Reasoning

A multi-day request may be valid on some days but not others. Checking every working day ensures the team capacity rule is respected throughout the leave period.

---

## 2. Rounding the 30% Rule

### Decision

I used `Math.ceil()` when calculating the maximum number of employees allowed on leave.

Example:

- Team of 3
- 30% = 0.9
- Maximum allowed = 1

### Alternatives Considered

- Round down (`Math.floor`)
- Round to nearest integer

### Reasoning

Rounding up provides a practical limit for small teams while still respecting the business requirement.

---

## 3. Overlapping Leave Requests

### Decision

Only APPROVED leave requests are considered when checking for overlapping dates.

Duplicate PENDING requests with identical dates are also prevented.

### Alternatives Considered

Reject all overlapping pending requests.

### Reasoning

The specification explicitly states that approved overlaps are invalid but leaves pending overlaps open to interpretation. Preventing exact duplicate pending requests avoids accidental duplicate submissions while allowing managers to decide between competing requests.
