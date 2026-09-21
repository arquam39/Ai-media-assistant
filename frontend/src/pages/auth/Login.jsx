import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import AuthLayout from "../../components/auth/AuthLayout";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";

import {
    login,
    clearAuthError,
} from "../../store/slices/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [rememberMe, setRememberMe] = useState(false);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        if (error) {
            dispatch(clearAuthError());
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            await dispatch(
                login({
                    email: formData.email,
                    password: formData.password,
                })
            ).unwrap();

            navigate("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <AuthLayout
            title="Log in to your account"
            subtitle="Please enter your details"
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                <AuthInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    icon={Mail}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    icon={Lock}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                />

                {/* Forgot Password */}
                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Forgot password?
                    </Link>
                </div>

                {/* Redux error */}
                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {error}
                    </div>
                )}

                {/* Login button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />

                            Logging in...
                        </>
                    ) : (
                        "Log in"
                    )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-blue-100 dark:bg-white/10" />

                    <span className="text-xs font-medium text-slate-400">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-blue-100 dark:bg-white/10" />
                </div>

                {/* Register */}
                <p className="pt-3 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default Login;