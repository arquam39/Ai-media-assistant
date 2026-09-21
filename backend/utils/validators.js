import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z
        .string()
        .trim()
        .email("Please provide a valid email"),

    password: z
        .string()
        .min(
            8,
            "Password must be at least 8 characters"
        )
        .max(
            100,
            "Password cannot exceed 100 characters"
        )
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .regex(
            /[a-z]/,
            "Password must contain at least one lowercase letter"
        )
        .regex(
            /\d/,
            "Password must contain at least one number"
        )
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        ),
});


export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Please provide a valid email"),

    password: z
        .string()
        .min(1, "Password is required")
});


export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2)
        .max(50)
        .optional(),

    bio: z
        .string()
        .trim()
        .max(500)
        .optional()
});


export const passwordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, "Current password is required"),

    newPassword: z
        .string()
        .min(
            8,
            "Password must be at least 8 characters"
        )
        .max(
            100,
            "Password cannot exceed 100 characters"
        )
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .regex(
            /[a-z]/,
            "Password must contain at least one lowercase letter"
        )
        .regex(
            /\d/,
            "Password must contain at least one number"
        )
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        ),
});


export const settingsSchema = z.object({
    theme: z
        .enum(["light", "dark", "system"])
        .optional(),

    notifications: z
        .boolean()
        .optional()
});


export const conversationSchema = z.object({
    mediaId: z
        .string()
        .optional(),

    title: z
        .string()
        .trim()
        .max(100)
        .optional()
});


export const messageSchema = z.object({
    conversationId: z
        .string()
        .min(1),

    content: z
        .string()
        .trim()
        .min(1, "Message cannot be empty")
        .max(5000, "Message is too long")
});