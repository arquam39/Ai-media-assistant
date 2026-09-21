import { forwardRef } from "react";

const AuthInput = forwardRef(function AuthInput(
    {
        label,
        type = "text",
        placeholder,
        icon: Icon,
        error,
        ...props
    },
    ref
) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={props.name}
                className="block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
                {label}
            </label>

            <div className="relative">
                {Icon && (
                    <Icon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                )}

                <input
                    ref={ref}
                    id={props.name}
                    type={type}
                    placeholder={placeholder}
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

                        ${Icon ? "pl-10" : ""}

                        ${
                            error
                                ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 dark:border-red-500/40"
                                : "border-blue-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:focus:border-blue-500"
                        }
                    `}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
});

export default AuthInput;