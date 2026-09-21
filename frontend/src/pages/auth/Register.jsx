import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    LoaderCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import {
    register,
    clearAuthError,
} from "../../store/slices/authSlice";


const registerSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, "Name is required"),

        email: z
            .string()
            .trim()
            .min(1, "Email is required")
            .email("Enter a valid email"),

        password: z
            .string()
            .min(
                8,
                "Password must be at least 8 characters"
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

        confirmPassword: z.string(),
    })
    .refine(
        (data) =>
            data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );


function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        error,
        success,
    } = useSelector((state) => state.auth);


    const {
        register: registerField,
        handleSubmit,
        formState: {
            errors,
        },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });


const handleSubmitForm = async (formData) => {

    if (error) {
        dispatch(clearAuthError());
    }

    try {

        await dispatch(
            register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            })
        ).unwrap();

        navigate(
            `/verify-email?email=${encodeURIComponent(
                formData.email
            )}`
        );

    } catch (error) {

        console.error(
            "Registration failed:",
            error
        );

    }
};


    return (
        <AuthLayout
            title="Create your account"
            subtitle="Get started with your AI Media Assistant"
        >
            <form
                onSubmit={handleSubmit(handleSubmitForm)}
                className="space-y-3"
            >
                <AuthInput
                    label="Name"
                    name="name"
                    placeholder="Enter your name"
                    icon={User}
                    {...registerField("name")}
                    error={errors.name?.message}
                    compact
                />

                <AuthInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    icon={Mail}
                    {...registerField("email")}
                    error={errors.email?.message}
                    compact
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    icon={Lock}
                    {...registerField("password")}
                    error={errors.password?.message}
                    compact
                />

                <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    icon={Lock}
                    {...registerField("confirmPassword")}
                    error={errors.confirmPassword?.message}
                    compact
                />

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-600 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                        Account created successfully.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />

                            Creating account...
                        </>
                    ) : (
                        "Create account"
                    )}
                </button>

                <p className="pt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default Register;