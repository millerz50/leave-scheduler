"use client";

import { useEffect, useState } from "react";

export default function LeaveCalendar({ refresh }: { refresh: number }) {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/leave")
      .then((res) => res.json())

      .then(setLeaves);
  }, [refresh]);

  return (
    <div className="bg-white shadow rounded p-5">
      <h2 className="text-xl font-semibold mb-4">Next 30 Days Leave</h2>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Employee</th>

            <th className="border p-2">Team</th>

            <th className="border p-2">Start</th>

            <th className="border p-2">End</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id}>
              <td className="border p-2">{leave.employee.name}</td>

              <td className="border p-2">{leave.employee.team}</td>

              <td className="border p-2">
                {new Date(leave.startDate).toLocaleDateString()}
              </td>

              <td className="border p-2">
                {new Date(leave.endDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
