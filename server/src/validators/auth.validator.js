import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string({
      error: "Username is required",
    })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters"),

  email: z
    .string({
      error: "Email is required",
    })
    .trim()
    .email("Please provide a valid email"),

  password: z
    .string({
      error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),
});

const loginSchema = z.object({
  email: z
    .string({
      error: "Email is required",
    })
    .trim()
    .email("Please provide a valid email"),

  password: z
    .string({
      error: "Password is required",
    })
    .min(1, "Password is required"),
});

export { registerSchema,loginSchema };