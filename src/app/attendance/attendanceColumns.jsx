import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const attendanceColumns = (onToggleStatus) => [
  columnHelper.accessor("employee_code", {
    header: "Employee Code",
  }),
  columnHelper.accessor("name", {
    header: "Employee Name",
  }),
  columnHelper.accessor("department", {
    header: "Department",
  }),
  columnHelper.display({
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const { id, status } = row.original;

      return (
        <button
          onClick={() => onToggleStatus(id)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
            status === "Present"
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
          }`}
        >
          {status}
        </button>
      );
    },
  }),
];
