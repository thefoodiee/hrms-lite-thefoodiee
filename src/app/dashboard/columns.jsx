import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper();

export const columns = [
  columnHelper.accessor("name", {
    header: "Employee Name",
  }),
  columnHelper.accessor("department", {
    header: "Department",
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: ({ getValue }) =>
      new Date(getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            status === "Present"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      );
    },
  }),
];
