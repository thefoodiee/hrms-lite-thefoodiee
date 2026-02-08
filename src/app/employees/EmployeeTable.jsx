"use client";

import React, { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { columns } from "./columns";

const EmployeeTable = ({ data, loading, onDeleteSuccess }) => {
  const router = useRouter();

  const handleViewAttendance = (employeeId) => {
    router.push(`/attendance/${employeeId}`);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to delete employee");
        return;
      }

      onDeleteSuccess();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      a.employee_code.localeCompare(b.employee_code)
    );
  }, [data]);

  const table = useReactTable({
    data: sortedData,
    columns: columns(handleDelete, handleViewAttendance),
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <div className="p-4">Loading...</div>;
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

export default EmployeeTable;