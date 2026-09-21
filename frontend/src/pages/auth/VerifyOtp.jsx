import { useEffect, useState } from "react";
import {
    ShieldCheck,
    ArrowLeft,
    ArrowRight,
    LoaderCircle,
} from "lucide-react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import { verifyOtp } from "../../services/authService.js";

const verifyOtpSchema = z.object({
    otp: z
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .regex(/^\d+$/, "OTP must contain only numbers"),
});

function VerifyOtp() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: "",
        },
    });

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password", {
                replace: true,
            });
        }
    }, [email, navigate]);

    const onSubmit = async (data) => {
        if (!email) return;

        try {
            setLoading(true);
            setError("");

            const response = await verifyOtp(
                email,
                data.otp
            );

            const resetToken = response.resetToken;

            if (!resetToken) {
                throw new Error(
                    "Reset token was not received"
                );
            }

            navigate("/reset-password", {
                state: {
                    resetToken
                }
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AuthLayout
            title="Verify your email"
            subtitle="Enter the 6-digit OTP we sent to your email address."
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 dark:border-white/10 dark:bg-white/3"
                >
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        OTP sent to
                    </p>

                    <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                        {email}
                    </p>
                </div>

                <AuthInput
                    label="Verification code"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    icon={ShieldCheck}
                    error={errors.otp?.message}
                    {...register("otp")}
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
                            Verifying...
                        </>
                    ) : (
                        <>
                            Verify OTP
                            <ArrowRight size={17} />
                        </>
                    )}
                </button>

                <div className="flex justify-center">
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                        <ArrowLeft size={16} />
                        Change email
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}

export default VerifyOtp;