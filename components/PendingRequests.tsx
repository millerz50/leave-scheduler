"use client";

import { useEffect, useState } from "react";

export default function PendingRequests({ refresh }: { refresh: number }) {
  const [requests, setRequests] = useState<any[]>([]);

  function load() {
    fetch("/api/leave")
      .then((res) => res.json())

      .then((data) => {
        setRequests(data.filter((r: any) => r.status === "PENDING"));
      });
  }

  useEffect(() => {
    load();
  }, [refresh]);

  async function action(id: number, type: "approve" | "reject") {
    await fetch(
      `/api/leave/${id}/${type}`,

      {
        method: "PATCH",
      },
    );

    load();
  }

  return (
    <div className="bg-white shadow rounded p-5">
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map((request) => (
        <div key={request.id} className="border p-3 mb-3">
          <p className="font-bold">{request.employee.name}</p>

          <p>{request.employee.team}</p>

          <p>
            {new Date(request.startDate).toDateString()}-
            {new Date(request.endDate).toDateString()}
          </p>

          <div className="mt-3 space-x-2">
            <button
              onClick={() => action(request.id, "approve")}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => action(request.id, "reject")}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
