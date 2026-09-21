import AuthBrand from "./AuthBrand";

function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="h-screen overflow-hidden bg-blue-50/50 p-3 dark:bg-[#09090b] sm:p-4">
            <div className="mx-auto flex h-full max-w-6xl overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-white/10 dark:bg-[#0c0c0f] lg:rounded-3xl">

                {/* =========================
                    LEFT SIDE — AI Media Assistant showcase
                ========================= */}
                <div className="relative hidden h-full overflow-hidden bg-blue-600 lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:px-9 lg:py-8">

                    {/* Mesh gradient blobs */}
                    <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl" />
                    <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-blue-800/40 blur-3xl" />
                    <div className="absolute right-1/3 top-1/3 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />

                    {/* Faint dot grid texture */}
                    <div
                        className="absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    />

                    {/* ---------- Top: badge + headline ---------- */}
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-blue-50 backdrop-blur-sm">
                            <svg className="h-3 w-3 text-blue-100" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
                            </svg>
                            AI Media Assistant
                        </span>

                        <h2 className="mt-4 max-w-sm text-2xl font-bold leading-snug text-white">
                            Upload it. Ask about it.
                            <br />
                            Let AI do the rest.
                        </h2>

                        <p className="mt-2 max-w-xs text-sm text-blue-100">
                            Chat with your images and videos like you would with a person who actually looked at them.
                        </p>
                    </div>

                    {/* ---------- Middle: media + AI chat mockup ---------- */}
                    <div className="relative z-10 mx-auto w-full max-w-75">

                        {/* Media thumbnail strip */}
                        <div className="mb-3 flex justify-center gap-2">
                            <div className="h-14 w-14 -rotate-6 overflow-hidden rounded-xl border-2 border-white/40 bg-linear-to-br from-amber-200 to-orange-300 shadow-lg" />
                            <div className="z-10 h-16 w-16 overflow-hidden rounded-xl border-2 border-white shadow-xl">
                                <div className="h-full w-full bg-linear-to-br from-blue-300 via-sky-200 to-indigo-300" />
                            </div>
                            <div className="h-14 w-14 rotate-6 overflow-hidden rounded-xl border-2 border-white/40 bg-linear-to-br from-emerald-200 to-teal-300 shadow-lg" />
                        </div>

                        {/* AI response card */}
                        <div className="rounded-2xl border border-white/20 bg-white/95 p-3.5 shadow-2xl backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                                    <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
                                    </svg>
                                </div>
                                <div className="h-1.5 w-16 rounded bg-slate-300" />
                                <span className="ml-auto flex gap-0.5">
                                    <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400" />
                                    <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />
                                    <span className="h-1 w-1 animate-pulse rounded-full bg-blue-400 [animation-delay:300ms]" />
                                </span>
                            </div>

                            <div className="mt-2.5 space-y-1.5">
                                <div className="h-1.5 w-full rounded bg-slate-100" />
                                <div className="h-1.5 w-[85%] rounded bg-slate-100" />
                                <div className="h-1.5 w-[60%] rounded bg-slate-100" />
                            </div>
                        </div>

                        {/* Floating "analyzed" chip */}
                        <div className="absolute -left-4 -top-3 flex items-center gap-1.5 rounded-full border border-white/30 bg-emerald-400/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg">
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            Analyzed
                        </div>
                    </div>

                    {/* ---------- Bottom: feature pills + trust row ---------- */}
                    <div className="relative z-10">
                        <div className="mb-5 flex flex-wrap gap-2">
                            {["Image chat", "Auto-tagging", "Smart search"].map((label) => (
                                <span
                                    key={label}
                                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-blue-50 backdrop-blur-sm"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 border-t border-white/15 pt-4">
                            <div className="flex -space-x-2">
                                <div className="h-7 w-7 rounded-full border-2 border-blue-600 bg-blue-300" />
                                <div className="h-7 w-7 rounded-full border-2 border-blue-600 bg-blue-200" />
                                <div className="h-7 w-7 rounded-full border-2 border-blue-600 bg-blue-400" />
                            </div>
                            <p className="text-xs text-blue-100">
                                Trusted by developers building smarter media workflows.
                            </p>
                        </div>
                    </div>

                </div>

                {/* =========================
                    RIGHT SIDE — Login form
                ========================= */}
                <div className="custom-scrollbar flex h-full w-full min-w-0 flex-col overflow-y-auto px-5 py-5 sm:px-8 sm:py-6 lg:w-1/2 lg:px-10">

                    <AuthBrand />

                    <div className="my-auto flex w-full max-w-md flex-col justify-center py-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                                {title}
                            </h1>

                            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                                {subtitle}
                            </p>
                        </div>

                        {children}
                    </div>

                    <p className="mt-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
                        By continuing, you agree to our{" "}
                        <span className="cursor-pointer underline decoration-slate-300 underline-offset-2 hover:text-slate-500 dark:decoration-slate-600">
                            Terms of Use
                        </span>{" "}
                        and{" "}
                        <span className="cursor-pointer underline decoration-slate-300 underline-offset-2 hover:text-slate-500 dark:decoration-slate-600">
                            Privacy Policy
                        </span>
                        .
                    </p>
                </div>

            </div>
        </div>
    );
}

export default AuthLayout;