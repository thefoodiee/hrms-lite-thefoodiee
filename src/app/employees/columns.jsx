// columns.js
export const columns = (handleDelete, handleViewAttendance) => [
  {
    accessorKey: "employee_code",
    header: "Employee Code",
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ getValue }) =>
      new Date(getValue()).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleViewAttendance(id)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            View Attendance
          </button>

          <button
            onClick={() => handleDelete(id)}
            className="text-red-600 hover:underline cursor-pointer"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
