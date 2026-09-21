import { useState } from "react";

function PasswordInput({
    label,
    error,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="space-y-2">

            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                {label}
            </label>


            <div className="relative">

                <input
                    {...props}
                    type={showPassword ? "text" : "password"}
                    className={`
                        w-full rounded-xl border
                        bg-white px-4 py-3
                        text-sm text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        dark:bg-white/3
                        dark:text-white
                        dark:placeholder:text-slate-500
                        ${
                            error
                                ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-red-500/40"
                                : "border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:focus:border-blue-500"
                        }
                    `}
                />


                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >

                    {showPassword ? (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M3 3l18 18" />
                            <path d="M10.6 10.7a2 2 0 102.8 2.8" />
                            <path d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.5 4 9.5 6a11.8 11.8 0 01-3.2 3.8" />
                            <path d="M6.2 6.2C4.3 7.5 3.1 9.3 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.8-.5" />
                        </svg>
                    ) : (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                            <circle cx="12" cy="12" r="2.5" />
                        </svg>
                    )}

                </button>

            </div>


            {error && (
                <p className="text-xs font-medium text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
}

export default PasswordInput;