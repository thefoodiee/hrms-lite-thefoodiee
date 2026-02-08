"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EmployeeAttendancePage = () => {
  const { employeeId } = useParams();
  const router = useRouter();

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch employee details
        const empRes = await fetch(`/api/employees/${employeeId}`);
        const empData = await empRes.json();

        if (!empRes.ok) {
          alert(empData.error || "Failed to load employee");
          return;
        }

        setEmployeeName(empData.full_name);

        // Fetch attendance records
        const attRes = await fetch(
          `/api/attendance/employee/${employeeId}`
        );
        const attData = await attRes.json();

        if (!attRes.ok) {
          alert(attData.error || "Failed to load attendance");
          return;
        }

        setAttendance(attData);
      } catch (error) {
        console.error(error);
        alert("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  if (loading) {
    return <div className="p-6">Loading attendance...</div>;
  }

  const totalPresentDays = attendance.filter(
    (record) => record.status === true
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-2 cursor-pointer text-blue-600 hover:underline"
          >
            Back
          </button>

          <h1 className="text-2xl font-bold">
            Employee Attendance
            {employeeName && (
              <span className="font-normal text-gray-600">
                {" "}
                – {employeeName}
              </span>
            )}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Present Days:{" "}
            <span className="font-medium text-gray-700">
              {totalPresentDays}
            </span>
          </p>
        </div>
      </div>

      {attendance.length === 0 ? (
        <p className="text-gray-500">
          No attendance records found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((record, index) => (
                <tr
                  key={index}
                  className="border-t transition hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm">
                    {new Date(
                      record.attendance_date
                    ).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        record.status
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {record.status ? "Present" : "Absent"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendancePage;
