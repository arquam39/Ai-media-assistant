import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mail, LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../../components/auth/AuthLayout";

import {
    verifyRegistration,
    clearAuthError,
} from "../../store/slices/authSlice";


function VerifyEmail() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");

    const [otp, setOtp] = useState("");

    const {
        loading,
        error,
    } = useSelector(
        (state) => state.auth
    );


    const handleVerify = async (e) => {

        e.preventDefault();

        if (error) {
            dispatch(clearAuthError());
        }

        try {

            await dispatch(
                verifyRegistration({
                    email,
                    otp,
                })
            ).unwrap();

            navigate("/login");

        } catch (error) {

            console.error(
                "Verification failed:",
                error
            );

        }
    };


    return (
        <AuthLayout
            title="Verify your email"
            subtitle={`Enter the verification code sent to ${email}`}
        >

            <form
                onSubmit={handleVerify}
                className="space-y-4"
            >

                <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <Mail size={26} />
                    </div>
                </div>


                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Verification code
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value
                                    .replace(/\D/g, "")
                            )
                        }
                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-3
                            text-center
                            text-lg
                            font-semibold
                            tracking-[0.4em]
                            text-slate-900
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-500/10
                            dark:border-slate-700
                            dark:bg-slate-900
                            dark:text-white
                        "
                    />
                </div>


                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}


                <button
                    type="submit"
                    disabled={
                        loading ||
                        otp.length !== 6
                    }
                    className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {loading ? (
                        <>
                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />

                            Verifying...
                        </>
                    ) : (
                        "Verify email"
                    )}

                </button>

            </form>

        </AuthLayout>
    );
}

export default VerifyEmail;