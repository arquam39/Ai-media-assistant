import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    FolderOpen,
    Sparkles,
    Heart,
    Trash2,
    User,
    Settings,
    X,
    ClipboardList,
    Building2
} from "lucide-react";

function Sidebar({
    isOpen,
    onClose,
}) {
    const navigate = useNavigate();

    const mainLinks = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Media Library",
            path: "/media",
            icon: FolderOpen,
        },
        {
            name: "AI Chat",
            path: "/chat",
            icon: Sparkles,
        },
        {
            name: "Favorites",
            path: "/favorites",
            icon: Heart,
        },
        {
            name: "Trash",
            path: "/trash",
            icon: Trash2,
        },
    ];

    const leasingLinks = [
        {
            name: "Applications",
            path: "/applications",
            icon: ClipboardList,
        },
        {
            name: "Submit Form",
            path: "/apply",
            icon: Building2,
        },
    ];

    const bottomLinks = [
        {
            name: "Profile",
            path: "/profile",
            icon: User,
        },
        {
            name: "Settings",
            path: "/settings",
            icon: Settings,
        },
    ];

    // Common classes for all navigation links
    const linkClasses = ({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
            ? "bg-[#e5e5e5bd] text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
            : "text-slate-500 hover:bg-blue-50/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        }`;

    const handleNavigation = () => {
        onClose();
    };

    return (
        <>
            {/* =========================
                Mobile Overlay
            ========================= */}

            {isOpen && (
                <div
                    onClick={onClose}
                    className="
                        fixed inset-0 z-40
                        bg-black/40
                        backdrop-blur-[2px]
                        lg:hidden
                    "
                />
            )}

            {/* =========================
                Sidebar
            ========================= */}

            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex h-screen w-64
                    flex-col
                    border-r border-blue-100
                    bg-white
                    transition-transform
                    duration-300
                    dark:border-white/10
                    dark:bg-[#0c0c0f]

                    lg:static
                    lg:z-auto
                    lg:flex
                    lg:translate-x-0

                    ${isOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >
                {/* =========================
                    Brand
                ========================= */}

                <div
                    className="
                        flex h-20 shrink-0
                        items-center
                        justify-between
                        border-b border-blue-100
                        px-6
                        dark:border-white/10
                    "
                >
                    <div
                        className="flex cursor-pointer items-center gap-3"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <div
                            className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                                shadow-blue-200
                                dark:bg-blue-500
                                dark:shadow-none
                            "
                        >
                            <Sparkles
                                size={18}
                                strokeWidth={2.2}
                            />
                        </div>

                        <span
                            className="
                                text-lg font-semibold
                                tracking-tight
                                text-slate-900
                                dark:text-white
                            "
                        >
                            MediaAI
                        </span>
                    </div>

                    {/* Close Button - Mobile */}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close sidebar"
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-blue-50
                            hover:text-blue-600
                            dark:text-slate-500
                            dark:hover:bg-white/5
                            dark:hover:text-white
                            lg:hidden
                        "
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* =========================
                    Navigation
                ========================= */}

                <nav
                    className="
                    custom-scrollbar
                        flex-1
                        overflow-y-auto
                        px-3 py-6
                    "
                >
                    {/* Workspace */}

                    <p
                        className="
                            mb-3 px-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        Workspace
                    </p>

                    <div className="space-y-1">
                        {mainLinks.map((link) => {
                            const Icon =
                                link.icon;

                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    onClick={
                                        handleNavigation
                                    }
                                    className={
                                        linkClasses
                                    }
                                >
                                    {({
                                        isActive
                                    }) => (
                                        <>
                                            {isActive && (
                                                <span
                                                    className="
                                                        absolute left-0
                                                        h-5 w-0.5
                                                        rounded-full
                                                        bg-blue-600
                                                        dark:bg-blue-400
                                                    "
                                                />
                                            )}

                                            <Icon
                                                size={18}
                                                strokeWidth={
                                                    1.9
                                                }
                                                className={
                                                    isActive
                                                        ? "text-blue-600 dark:text-blue-400"
                                                        : "text-slate-400 transition-colors group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                                                }
                                            />

                                            <span>
                                                {
                                                    link.name
                                                }
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* =========================
                        Leasing
                    ========================= */}

                    <p
                        className="
                            mb-3 mt-7 px-3
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-400
                            dark:text-slate-500
                        "
                    >
                        Leasing
                    </p>

                    <div className="space-y-1">
                        {leasingLinks.map(
                            (link) => {
                                const Icon =
                                    link.icon;

                                return (
                                    <NavLink
                                        key={
                                            link.path
                                        }
                                        to={
                                            link.path
                                        }
                                        onClick={
                                            handleNavigation
                                        }
                                        className={
                                            linkClasses
                                        }
                                    >
                                        {({
                                            isActive
                                        }) => (
                                            <>
                                                {isActive && (
                                                    <span
                                                        className="
                                                            absolute left-0
                                                            h-5 w-0.5
                                                            rounded-full
                                                            bg-blue-600
                                                            dark:bg-blue-400
                                                        "
                                                    />
                                                )}

                                                <Icon
                                                    size={
                                                        18
                                                    }
                                                    strokeWidth={
                                                        1.9
                                                    }
                                                    className={
                                                        isActive
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-slate-400 transition-colors group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                                                    }
                                                />

                                                <span>
                                                    {
                                                        link.name
                                                    }
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            }
                        )}
                    </div>
                </nav>

                {/* =========================
                    Bottom Navigation
                ========================= */}

                <div
                    className="
                        shrink-0
                        border-t border-blue-100
                        p-3
                        dark:border-white/10
                    "
                >
                    <div className="space-y-1">
                        {bottomLinks.map(
                            (link) => {
                                const Icon =
                                    link.icon;

                                return (
                                    <NavLink
                                        key={
                                            link.path
                                        }
                                        to={
                                            link.path
                                        }
                                        onClick={
                                            handleNavigation
                                        }
                                        className={
                                            linkClasses
                                        }
                                    >
                                        {({
                                            isActive
                                        }) => (
                                            <>
                                                {isActive && (
                                                    <span
                                                        className="
                                                            absolute left-0
                                                            h-5 w-0.5
                                                            rounded-full
                                                            bg-blue-600
                                                            dark:bg-blue-400
                                                        "
                                                    />
                                                )}

                                                <Icon
                                                    size={
                                                        18
                                                    }
                                                    strokeWidth={
                                                        1.9
                                                    }
                                                    className={
                                                        isActive
                                                            ? "text-blue-600 dark:text-blue-400"
                                                            : "text-slate-400 transition-colors group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300"
                                                    }
                                                />

                                                <span>
                                                    {
                                                        link.name
                                                    }
                                                </span>
                                            </>
                                        )}
                                    </NavLink>
                                );
                            }
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;