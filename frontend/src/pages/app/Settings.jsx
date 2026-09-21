import { useEffect, useState } from "react";
import {
    Settings as SettingsIcon,
    Moon,
    Bell,
    LogOut,
    X,
    AlertTriangle,
    LoaderCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../store/slices/authSlice";

function Settings() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector(
        (state) => state.auth
    );

    const [theme, setTheme] = useState(
        () =>
            localStorage.getItem("theme") ||
            "system"
    );

    const [notifications, setNotifications] =
        useState(false);

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    // =========================
    // Apply Theme
    // =========================

    useEffect(() => {
        const root =
            document.documentElement;

        const applyTheme = (selectedTheme) => {
            if (selectedTheme === "dark") {
                root.classList.add("dark");
                return;
            }

            if (selectedTheme === "light") {
                root.classList.remove("dark");
                return;
            }

            // System theme
            const systemDark =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;

            root.classList.toggle(
                "dark",
                systemDark
            );
        };

        applyTheme(theme);

        // Listen for system theme changes
        if (theme === "system") {
            const mediaQuery =
                window.matchMedia(
                    "(prefers-color-scheme: dark)"
                );

            const handleSystemThemeChange = (
                e
            ) => {
                root.classList.toggle(
                    "dark",
                    e.matches
                );
            };

            mediaQuery.addEventListener(
                "change",
                handleSystemThemeChange
            );

            return () => {
                mediaQuery.removeEventListener(
                    "change",
                    handleSystemThemeChange
                );
            };
        }
    }, [theme]);

    // =========================
    // Theme Change
    // =========================

    const handleThemeChange = (e) => {
        const selectedTheme =
            e.target.value;

        setTheme(selectedTheme);

        localStorage.setItem(
            "theme",
            selectedTheme
        );
    };

    // =========================
    // Logout
    // =========================

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();

            setShowLogoutModal(false);

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        }
    };

    return (
        <>
            <div className="mx-auto max-w-3xl space-y-6">

                {/* Header */}

                <div>
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                                dark:bg-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            <SettingsIcon size={20} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Settings
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                Customize your AI Media Assistant.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Preferences */}

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border border-blue-100
                        bg-white
                        shadow-sm
                        dark:border-white/10
                        dark:bg-white/[0.03]
                    "
                >

                    {/* Section Header */}

                    <div
                        className="
                            flex items-center gap-3
                            border-b border-blue-50
                            p-5
                            dark:border-white/10
                        "
                    >

                        <div
                            className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                bg-blue-50
                                text-blue-600
                                dark:bg-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            <SettingsIcon size={18} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">
                                Preferences
                            </h2>

                            <p className="text-xs text-slate-500 dark:text-zinc-500">
                                Control your application experience.
                            </p>
                        </div>

                    </div>

                    <div className="divide-y divide-blue-50 dark:divide-white/5">

                        {/* Theme */}

                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        dark:bg-blue-500/10
                                        dark:text-blue-400
                                    "
                                >
                                    <Moon size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Theme
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                        Choose your preferred appearance.
                                    </p>
                                </div>

                            </div>

                            <select
                                value={theme}
                                onChange={
                                    handleThemeChange
                                }
                                className="
                                    h-10
                                    rounded-xl
                                    border border-blue-100
                                    bg-white
                                    px-3
                                    text-sm
                                    font-medium
                                    text-slate-700
                                    outline-none
                                    transition
                                    focus:border-blue-300
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                    dark:border-white/10
                                    dark:bg-zinc-900
                                    dark:text-zinc-200
                                    dark:focus:border-blue-500/50
                                    dark:focus:ring-blue-500/10
                                "
                            >
                                <option value="system">
                                    System
                                </option>

                                <option value="light">
                                    Light
                                </option>

                                <option value="dark">
                                    Dark
                                </option>
                            </select>

                        </div>

                        {/* Notifications */}

                        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                        dark:bg-blue-500/10
                                        dark:text-blue-400
                                    "
                                >
                                    <Bell size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Notifications
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                        Receive updates and AI notifications.
                                    </p>
                                </div>

                            </div>

                            {/* Toggle */}

                            <button
                                type="button"
                                onClick={() =>
                                    setNotifications(
                                        !notifications
                                    )
                                }
                                aria-label="Toggle notifications"
                                aria-pressed={
                                    notifications
                                }
                                className={`
                                    relative
                                    h-6 w-11
                                    shrink-0
                                    rounded-full
                                    transition-colors
                                    focus:outline-none
                                    focus:ring-4
                                    focus:ring-blue-500/10

                                    ${
                                        notifications
                                            ? "bg-blue-600 dark:bg-blue-500"
                                            : "bg-slate-300 dark:bg-zinc-700"
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        absolute top-1
                                        h-4 w-4
                                        rounded-full
                                        bg-white
                                        shadow-sm
                                        transition-all

                                        ${
                                            notifications
                                                ? "left-6"
                                                : "left-1"
                                        }
                                    `}
                                />
                            </button>

                        </div>

                    </div>

                </section>

                {/* Account */}

                <section
                    className="
                        overflow-hidden
                        rounded-2xl
                        border border-red-100
                        bg-white
                        shadow-sm
                        dark:border-red-500/10
                        dark:bg-white/[0.03]
                    "
                >

                    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex h-10 w-10
                                    items-center justify-center
                                    rounded-xl
                                    bg-red-50
                                    text-red-500
                                    dark:bg-red-500/10
                                    dark:text-red-400
                                "
                            >
                                <LogOut size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Logout
                                </p>

                                <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                    Sign out of your MediaAI account.
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowLogoutModal(
                                    true
                                )
                            }
                            className="
                                flex items-center
                                justify-center gap-2
                                rounded-xl
                                border border-red-200
                                bg-red-50
                                px-4 py-2.5
                                text-sm font-semibold
                                text-red-600
                                transition
                                hover:bg-red-100
                                dark:border-red-500/20
                                dark:bg-red-500/10
                                dark:text-red-400
                                dark:hover:bg-red-500/15
                            "
                        >
                            <LogOut size={16} />
                            Logout
                        </button>

                    </div>

                </section>

            </div>

            {/* Logout Confirmation Modal */}

            {showLogoutModal && (
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-slate-900/40
                        p-4
                        backdrop-blur-sm
                        dark:bg-black/60
                    "
                    onClick={() =>
                        setShowLogoutModal(false)
                    }
                >
                    <div
                        className="
                            w-full max-w-sm
                            rounded-2xl
                            border border-blue-100
                            bg-white
                            p-6
                            shadow-2xl
                            dark:border-white/10
                            dark:bg-[#111113]
                        "
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* Modal Header */}

                        <div className="flex items-start justify-between">

                            <div
                                className="
                                    flex h-11 w-11
                                    items-center justify-center
                                    rounded-xl
                                    bg-red-50
                                    text-red-500
                                    dark:bg-red-500/10
                                    dark:text-red-400
                                "
                            >
                                <AlertTriangle
                                    size={21}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogoutModal(
                                        false
                                    )
                                }
                                disabled={loading}
                                className="
                                    flex h-8 w-8
                                    items-center justify-center
                                    rounded-lg
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-600
                                    disabled:opacity-50
                                    dark:hover:bg-white/5
                                    dark:hover:text-white
                                "
                            >
                                <X size={18} />
                            </button>

                        </div>

                        {/* Modal Content */}

                        <div className="mt-5">

                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Logout from MediaAI?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                                Are you sure you want to log out?
                                You will need to sign in again
                                to access your media.
                            </p>

                        </div>

                        {/* Actions */}

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogoutModal(
                                        false
                                    )
                                }
                                disabled={loading}
                                className="
                                    flex-1
                                    rounded-xl
                                    border border-blue-100
                                    bg-white
                                    px-4 py-2.5
                                    text-sm font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-blue-50
                                    disabled:opacity-50
                                    dark:border-white/10
                                    dark:bg-white/[0.03]
                                    dark:text-zinc-200
                                    dark:hover:bg-white/5
                                "
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loading}
                                className="
                                    flex-1
                                    flex items-center
                                    justify-center gap-2
                                    rounded-xl
                                    bg-red-600
                                    px-4 py-2.5
                                    text-sm font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-700
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
                                        Logging out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut
                                            size={17}
                                        />
                                        Logout
                                    </>
                                )}
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default Settings;