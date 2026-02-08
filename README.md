# HRMS Lite

Live at: [hrms-lite-rouge.vercel.app](https://hrms-lite-rouge.vercel.app)

HRMS Lite is a lightweight, web-based Human Resource Management System designed to manage employee records and track daily attendance.  
The application simulates a basic internal HR tool with a clean UI, RESTful APIs, and persistent storage.

The project focuses on core HR operations such as employee management and attendance tracking, without unnecessary complexity.

---

## 🚀 Project Overview

**Features**

### Employee Management
- Add new employees with:
  - Employee Code (unique)
  - Full Name
  - Email Address
  - Department
- View all employees in a table
- Delete employees
- View attendance history for a specific employee

### Attendance Management
- Mark daily attendance for all employees
- Toggle attendance status (Present / Absent)
- Submit attendance for a selected date
- View attendance records per employee
- Dashboard summary of:
  - Total employees
  - Present count
  - Absent count
  - Attendance percentage

### Dashboard
- Displays today’s attendance summary
- Shows a table of employee attendance for the current date

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **TanStack Table**
- **React Icons**

### Backend
- **Next.js API Routes (RESTful APIs)**

### Database
- **Supabase (PostgreSQL)**

### Deployment
- **Vercel** (Frontend + Backend)
- **Supabase Cloud** (Database)

---

## ⚙️ Steps to Run the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/thefoodiee/hrms-lite.git
cd hrms-lite
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up Environment Variables
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the development server
```
npm run dev
```

### 5. Open the app
```
http://localhost:3000
```

---

## Supabase Setup

This master query can be run in the supabase console to replicate the original database schema - 
```
-- =========================
-- UPDATED_AT TRIGGER FUNCTION
-- =========================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================
-- EMPLOYEES TABLE
-- =========================
create table public.employees (
  id uuid not null default gen_random_uuid(),
  employee_code text not null,
  full_name text not null,
  email text not null,
  department text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint employees_pkey primary key (id),
  constraint employees_email_key unique (email),
  constraint employees_employee_code_key unique (employee_code),
  constraint email_format_check check (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
) tablespace pg_default;

-- Trigger for updated_at
create trigger update_employees_updated_at
before update on public.employees
for each row
execute function public.update_updated_at_column();

-- =========================
-- ATTENDANCE TABLE
-- =========================
create table public.attendance (
  id uuid not null default gen_random_uuid(),
  employee_id uuid not null,
  attendance_date date not null,
  status boolean not null,
  created_at timestamptz not null default now(),

  constraint attendance_pkey primary key (id),
  constraint unique_employee_attendance unique (employee_id, attendance_date),
  constraint attendance_employee_id_fkey
    foreign key (employee_id)
    references public.employees (id)
    on delete cascade
) tablespace pg_default;

-- =========================
-- ROW LEVEL SECURITY
-- =========================
alter table public.employees enable row level security;
alter table public.attendance enable row level security;

-- =========================
-- EMPLOYEES POLICIES
-- insert, delete, select → public
-- =========================
create policy "employees_select_public"
on public.employees
for select
to public
using (true);

create policy "employees_insert_public"
on public.employees
for insert
to public
with check (true);

create policy "employees_delete_public"
on public.employees
for delete
to public
using (true);

-- =========================
-- ATTENDANCE POLICIES
-- insert, update, select → public
-- =========================
create policy "attendance_select_public"
on public.attendance
for select
to public
using (true);

create policy "attendance_insert_public"
on public.attendance
for insert
to public
with check (true);

create policy "attendance_update_public"
on public.attendance
for update
to public
using (true);

```
---
## Assumptions & Limitations
- The application assumes a single admin user
- No authentication or authorization is implemented
- Leave management, payroll, and advanced HR features are intentionally out of scope
- Attendance is tracked on a per-day basis
- Employees without an attendance record for a selected date are treated as Absent

## Deployment
The application is deployed on Vercel and uses Supabase for data storage.
- Frontend and backend are hosted together using Next.js
- API routes are secured using Supabase service role keys on the server
