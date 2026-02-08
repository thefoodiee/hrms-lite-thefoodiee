import React from "react";
import { FaPeopleGroup, FaUsers, FaCalendarCheck } from "react-icons/fa6";
import Link from "next/link";

const Navbar = () => {
  return (
    <aside className="h-screen w-64 bg-white border-r flex flex-col justify-between p-4">
      
      {/* Logo / App Name */}
      <div>
        <div className="flex items-center gap-2 mb-8 text-black">
          <FaPeopleGroup size={24} />
          <p className="text-lg font-semibold">HRMS Lite</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <NavButton icon={FaPeopleGroup} label="Dashboard" href="/dashboard" />
          <NavButton icon={FaUsers} label="Employees" href="/employees" />
          <NavButton icon={FaCalendarCheck} label="Attendance" href="/attendance" />
        </nav>
      </div>

      {/* Admin Info */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium">Admin User</p>
        <p className="text-xs text-gray-500">admin@company.com</p>
      </div>
    </aside>
  );
};

export default Navbar;

export const NavButton = ({ icon: Icon, label, href }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
    >
      {Icon && <Icon size={18} />}
      <span className="text-sm">{label}</span>
    </Link>
  );
};
