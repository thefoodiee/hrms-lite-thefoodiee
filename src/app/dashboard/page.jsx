"use client";

import React, { useEffect, useState } from "react";
import { FaCalendar, FaCheckCircle } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

import DashboardTable from "./DashboardTable";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    percentage: "0%",
  });

  useEffect(() => {
    const fetchStats = async () => {
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

        let presentCount = 0;
        let absentCount = 0;

        employees.forEach((employee) => {
          if (attendanceMap[employee.id]) {
            presentCount++;
          } else {
            absentCount++;
          }
        });

        const total = employees.length;
        const percentage =
          total === 0
            ? "0%"
            : `${((presentCount / total) * 100).toFixed(1)}%`;

        setStats({
          totalEmployees: total,
          present: presentCount,
          absent: absentCount,
          percentage,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="grid grid-cols-4 gap-6">
        <InfoCard
          icon={MdPeopleAlt}
          label="Total Employees"
          subtitle={stats.totalEmployees}
          iconColor="text-blue-500"
        />

        <InfoCard
          icon={FaCalendar}
          label="Today's Attendance"
          subtitle={stats.percentage}
          iconColor="text-purple-500"
        />

        <InfoCard
          icon={FaCheckCircle}
          label="Present"
          subtitle={stats.present}
          iconColor="text-green-500"
        />

        <InfoCard
          icon={IoIosCloseCircle}
          label="Absent"
          subtitle={stats.absent}
          iconColor="text-red-500"
        />
      </div>

      <h2 className="text-3xl font-bold">
        Today's Attendance
      </h2>

      <DashboardTable />
    </div>
  );
};

export default Dashboard;

export const InfoCard = ({
  icon: Icon,
  label,
  subtitle,
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-md">
      {Icon && <Icon className={`${iconColor} text-3xl`} />}

      <p className="text-sm text-gray-500">{label}</p>

      <p className="text-2xl font-semibold">{subtitle}</p>
    </div>
  );
};

