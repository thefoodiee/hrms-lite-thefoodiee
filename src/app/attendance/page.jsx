"use client";

import { useState } from "react";
import AttendanceTable from "./AttendanceTable";

const Attendance = () => {
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState([]);

  const handleLoad = async () => {
    if (!date) return;

    try {
      // Fetch employees
      const empRes = await fetch("/api/employees");
      const employees = await empRes.json();

      // Fetch attendance for selected date
      const attRes = await fetch(`/api/attendance?date=${date}`);
      const attendanceData = await attRes.json();

      // Build attendance lookup
      const attendanceMap = {};
      attendanceData.forEach((record) => {
        attendanceMap[record.employee_id] = record.status;
      });

      const mergedData = employees.map((employee) => ({
        id: employee.id,
        employee_code: employee.employee_code,
        name: employee.full_name,
        department: employee.department,
        status:
          attendanceMap[employee.id] === undefined
            ? "Absent"
            : attendanceMap[employee.id]
              ? "Present"
              : "Absent",
      }));

      mergedData.sort((a, b) =>
        a.employee_code.localeCompare(b.employee_code)
      );

      setAttendance(mergedData);
    } catch (error) {
      console.error(error);
      alert("Failed to load attendance");
    }
  };

  const toggleStatus = (id) => {
    setAttendance((prev) =>
      prev.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              status:
                employee.status === "Present"
                  ? "Absent"
                  : "Present",
            }
          : employee
      )
    );
  };

  const submitAttendance = async () => {
    if (!date) return;

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          records: attendance.map((employee) => ({
            employee_id: employee.id,
            status: employee.status === "Present",
          })),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to submit attendance");
        return;
      }

      // Reset state after successful submission
      setAttendance([]);
      setDate("");

      alert("Attendance submitted successfully");
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold">Attendance</h1>
      </div>

      {/* Controls */}
      <div className="mb-6 flex items-end gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
        </div>

        <button
          onClick={handleLoad}
          disabled={!date}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50 cursor-pointer disabled:cursor-default"
        >
          Load
        </button>
      </div>

      {/* Table */}
      <AttendanceTable
        data={attendance}
        onToggleStatus={toggleStatus}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={submitAttendance}
          disabled={!date}
          className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50 cursor-pointer disabled:cursor-default"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Attendance;
