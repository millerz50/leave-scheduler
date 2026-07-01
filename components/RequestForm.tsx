//submission form
"use client";

import { useEffect, useState } from "react";

type Employee = {
  id: number;
  name: string;
  team: string;
};

export default function RequestForm({ onSuccess }: { onSuccess: () => void }) {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [form, setForm] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  async function submit() {
    const response = await fetch("/api/leave", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);

      return;
    }

    alert("Leave request submitted");

    onSuccess();
  }

  return (
    <div className="bg-white rounded shadow p-5">
      <h2 className="text-xl font-semibold mb-4">Submit Leave Request</h2>

      <select
        className="border p-2 w-full mb-3"
        value={form.employeeId}
        onChange={(e) =>
          setForm({
            ...form,
            employeeId: e.target.value,
          })
        }
      >
        <option value="">Select employee</option>

        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name} - {emp.team}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            startDate: e.target.value,
          })
        }
      />

      <input
        type="date"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setForm({
            ...form,
            endDate: e.target.value,
          })
        }
      />

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit Request
      </button>
    </div>
  );
}
