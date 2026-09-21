import { useState } from "react";
import {
    Mail,
    ArrowLeft,
    ArrowRight,
    LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import { forgotPassword } from "../../services/authService.js";

const forgotPasswordSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address"),
});

function ForgotPassword() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            setError("");

            await forgotPassword(data.email);

            navigate(
                `/verify-otp?email=${encodeURIComponent(
                    data.email
                )}`
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your email and we'll send you a verification code."
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <AuthInput
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    error={errors.email?.message}
                    {...register("email")}
                />

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        flex w-full
                        items-center justify-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-4 py-2.5
                        text-sm font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:bg-blue-500
                        dark:hover:bg-blue-600
                    "
                >
                    {loading ? (
                        <>
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />
                            Sending OTP...
                        </>
                    ) : (
                        <>
                            Send OTP
                            <ArrowRight size={17} />
                        </>
                    )}
                </button>

                <div className="flex justify-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                        <ArrowLeft size={16} />
                        Back to login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

export default ForgotPassword;