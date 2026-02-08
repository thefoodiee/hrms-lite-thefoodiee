"use client";

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { columns } from "./columns";

const DashboardTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Fetch employees
        const empRes = await fetch("/api/employees");
        const employees = await empRes.json();

        // Fetch today's attendance
        const attRes = await fetch(`/api/attendance?date=${today}`);
        const attendance = await attRes.json();

        // Build attendance lookup
        const attendanceMap = {};
        attendance.forEach((record) => {
          attendanceMap[record.employee_id] = record.status;
        });

        // Merge data for dashboard
        const mergedData = employees.map((employee) => ({
          name: employee.full_name,
          department: employee.department,
          date: today,
          status: attendanceMap[employee.id] ? "Present" : "Absent",
        }));

        setData(mergedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div className="p-4">Loading dashboard data...</div>;
  }

  return (
    <div className="overflow-x-auto bg-white border rounded-xl">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t hover:bg-gray-50 transition"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
