import { useEffect, useState } from "react";
import {
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    LoaderCircle,
} from "lucide-react";
import {
    useLocation,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth//PasswordInput.jsx";
import { resetPassword } from "../../services/authService.js";

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
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
        (data) => data.password === data.confirmPassword,
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        }
    );

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();

    const resetToken =
        location.state?.resetToken;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (!resetToken) {
            navigate("/forgot-password", {
                replace: true,
            });
        }
    }, [resetToken, navigate]);

    const onSubmit = async (data) => {
        if (!resetToken) return;

        try {
            setLoading(true);
            setError("");

            await resetPassword(
                resetToken,
                data.password
            );

            setSuccess(true);

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 1500);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create a new password"
            subtitle="Choose a strong password for your account."
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="relative">
                    <PasswordInput
                        label="New password"
                        placeholder="Enter new password"
                        icon={LockKeyhole}
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    {/* <button
                        type="button"
                        onClick={() =>
                            setShowPassword(
                                (value) => !value
                            )
                        }
                        className="absolute right-3 top-[37px] flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={17} />
                        ) : (
                            <Eye size={17} />
                        )}
                    </button> */}
                </div>

                <div className="relative">
                    <PasswordInput
                        label="Confirm password"
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        placeholder="Confirm new password"
                        icon={LockKeyhole}
                        error={
                            errors.confirmPassword
                                ?.message
                        }
                        {...register(
                            "confirmPassword"
                        )}
                    />

                    {/* <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(
                                (value) => !value
                            )
                        }
                        className="absolute right-3 top-[37px] flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-200"
                        aria-label={
                            showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showConfirmPassword ? (
                            <EyeOff size={17} />
                        ) : (
                            <Eye size={17} />
                        )}
                    </button> */}
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
                        Password reset successfully.
                        Redirecting to login...
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || success}
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
                            Resetting password...
                        </>
                    ) : (
                        <>
                            Reset password
                            <ArrowRight size={17} />
                        </>
                    )}
                </button>
            </form>
        </AuthLayout>
    );
}

export default ResetPassword;