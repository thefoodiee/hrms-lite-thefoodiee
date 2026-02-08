"use client";

import React, { useEffect, useState, useCallback } from "react";
import EmployeeTable from "./EmployeeTable";
import AddEmployeeDialog from "./AddEmployeeDialog";

const Employees = () => {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/employees");

      if (!res.ok) {
        console.error("Failed to fetch employees");
        return;
      }

      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b-2 pb-4">
        <h1 className="text-3xl font-bold">Employees</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add Employee
        </button>
      </div>

      <EmployeeTable
        data={employees}
        loading={loading}
        onDeleteSuccess={fetchEmployees}
      />

      <AddEmployeeDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
};

export default Employees;
