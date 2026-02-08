"use client";

import { useForm } from "react-hook-form";

const AddEmployeeDialog = ({ open, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  if (!open) return null;

  const onSubmit = async (formData) => {
    const payload = {
      employee_code: formData.employee_code,
      full_name: formData.full_name,
      email: formData.email,
      department: formData.department,
    };

    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to add employee");
        return;
      }

      reset();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          Add Employee
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* code */}
          <div>
            <label className="text-sm font-medium">
              Employee Code
            </label>
            <input
              {...register("employee_code", {
                required: "Employee code is required",
              })}
              className="w-full mt-1 border rounded-md px-3 py-2"
            />
            {errors.employee_code && (
              <p className="text-xs text-red-500 mt-1">
                {errors.employee_code.message}
              </p>
            )}
          </div>

          {/* name */}
          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>
            <input
              {...register("full_name", {
                required: "Name is required",
              })}
              className="w-full mt-1 border rounded-md px-3 py-2"
            />
            {errors.full_name && (
              <p className="text-xs text-red-500 mt-1">
                {errors.full_name.message}
              </p>
            )}
          </div>

          {/* department */}
          <div>
            <label className="text-sm font-medium">
              Department
            </label>
            <input
              {...register("department", {
                required: "Department is required",
              })}
              className="w-full mt-1 border rounded-md px-3 py-2"
            />
            {errors.department && (
              <p className="text-xs text-red-500 mt-1">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* email */}
          <div>
            <label className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full mt-1 border rounded-md px-3 py-2"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeDialog;
