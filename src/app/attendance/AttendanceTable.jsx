import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { attendanceColumns } from "./attendanceColumns";

const AttendanceTable = ({ data, onToggleStatus }) => {
  const table = useReactTable({
    data,
    columns: attendanceColumns(onToggleStatus),
    getCoreRowModel: getCoreRowModel(),
  });

  if (!data.length) {
    return (
      <p className="text-sm text-gray-500">
        Select a date and click Load to view attendance.
      </p>
    );
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

export default AttendanceTable;
