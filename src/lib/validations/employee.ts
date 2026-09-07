import { z } from "zod";

export const employeeSchema = z.object({
  employeeCode: z
    .string()
    .trim()
    .min(2, "Employee code is required.")
    .max(40, "Keep the code under 40 characters."),
  fullName: z.string().trim().min(2, "Full name is required."),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().optional(),
  nid: z.string().trim().optional(),
  role: z.enum(["staff", "hr", "office_assistant"]),
  status: z.enum(["active", "inactive", "terminated"]),
  department: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  joiningDate: z.string().optional(),
  basicSalaryBdt: z.number().min(0, "Salary cannot be negative."),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;

export const EMPLOYEE_ROLE_OPTIONS = [
  { value: "staff", label: "Staff" },
  { value: "hr", label: "HR" },
  { value: "office_assistant", label: "Office assistant" },
] as const;

export const EMPLOYEE_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "terminated", label: "Terminated" },
] as const;
