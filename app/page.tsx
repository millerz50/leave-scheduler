"use client";

import { useEffect, useState } from "react";

import RequestForm from "@/components/RequestForm";
import PendingRequests from "@/components/PendingRequests";
import LeaveCalendar from "@/components/LeaveCalendar";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  function reload() {
    setRefresh((prev) => prev + 1);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Team Leave Scheduler</h1>

      <div className="space-y-8">
        <RequestForm onSuccess={reload} />

        <PendingRequests refresh={refresh} />

        <LeaveCalendar refresh={refresh} />
      </div>
    </main>
  );
}
