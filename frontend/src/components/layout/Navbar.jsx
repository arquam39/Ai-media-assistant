import { useEffect, useState } from "react";

import {
    Menu,
    Search,
    Sun,
    Moon,
    Bell,
    ChevronDown,
} from "lucide-react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import { useSelector } from "react-redux";

function Navbar({ onMenuClick }) {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // =========================
    // User
    // =========================

    const user = useSelector(
        (state) => state.auth.user
    );

    const userName = user?.name || "User";

    const firstName =
        userName.split(" ")[0] || "User";

    // =========================
    // Theme
    // =========================

    const [darkMode, setDarkMode] = useState(
        () =>
            localStorage.getItem("theme") === "dark"
    );

    // =========================
    // Search
    // =========================

    const [search, setSearch] = useState(
        () => searchParams.get("search") || ""
    );

    // =========================
    // Apply saved theme
    // =========================

    useEffect(() => {
        const savedTheme =
            localStorage.getItem("theme");

        document.documentElement.classList.toggle(
            "dark",
            savedTheme === "dark"
        );
    }, []);

    // =========================
    // Sync search with URL
    // =========================

    useEffect(() => {
        setSearch(
            searchParams.get("search") || ""
        );
    }, [searchParams]);

    // =========================
    // Toggle theme
    // =========================

    const toggleTheme = () => {
        const newDarkMode = !darkMode;

        setDarkMode(newDarkMode);

        document.documentElement.classList.toggle(
            "dark",
            newDarkMode
        );

        localStorage.setItem(
            "theme",
            newDarkMode ? "dark" : "light"
        );
    };

    // =========================
    // Search
    // =========================

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearch(value);

        if (value.trim()) {
            navigate(
                `/media?search=${encodeURIComponent(
                    value.trim()
                )}`
            );
        } else {
            navigate("/media");
        }
    };

    const handleSearchFocus = () => {
        if (window.location.pathname !== "/media") {

            if (search.trim()) {
                navigate(
                    `/media?search=${encodeURIComponent(
                        search.trim()
                    )}`
                );
            } else {
                navigate("/media");
            }
        }
    };

    return (
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-blue-100 bg-white px-4 dark:border-white/10 dark:bg-[#0c0c0f] sm:px-6 lg:px-8">

            {/* =========================
                Left side
            ========================= */}

            <div className="flex min-w-0 items-center gap-3">

                {/* Mobile menu button */}

                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open sidebar"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10 lg:hidden"
                >
                    <Menu size={21} />
                </button>

                {/* Mobile logo */}

                <div className="flex items-center gap-2 lg:hidden">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white dark:bg-blue-500">
                        <span className="text-sm">
                            ✦
                        </span>
                    </div>

                    <span className="hidden font-semibold text-slate-900 dark:text-white xs:block sm:block">
                        MediaAI
                    </span>

                </div>

                {/* Desktop search */}

                <div className="hidden max-w-md flex-1 lg:block">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            onFocus={handleSearchFocus}
                            placeholder="Search media..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-[#e5e5e5e6] pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/10"
                        />

                    </div>

                </div>

            </div>

            {/* =========================
                Right side
            ========================= */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">

                {/* Theme */}

                <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                >
                    {darkMode ? (
                        <Sun size={19} />
                    ) : (
                        <Moon size={19} />
                    )}
                </button>

                {/* Notification */}
{/* 
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                >
                    <Bell size={19} />

                    <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                </button> */}

                {/* User */}

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-white/10 sm:px-3  cursor-pointer"
                    onClick={() => navigate("/profile")}
                >

                    {/* Avatar */}

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white dark:bg-blue-500">
                        {userName
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    {/* User information */}

                    <div className="hidden text-left sm:block">

                        <p className="max-w-30 truncate text-sm font-semibold text-slate-800 dark:text-white">
                            {userName}
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            User
                        </p>

                    </div>

                </button>

            </div>

        </header>
    );
}

export default Navbar;