import {
    Search,
    Grid2X2,
    List,
    Image,
    Video,
    Music,
    FileText,
    Files,
} from "lucide-react";

function MediaFilters({
    search,
    setSearch,
    activeFilter,
    setActiveFilter,
    viewMode,
    setViewMode,
}) {
    const filters = [
        {
            id: "all",
            label: "All",
            icon: Files,
        },
        {
            id: "image",
            label: "Images",
            icon: Image,
        },
        // {
        //     id: "video",
        //     label: "Videos",
        //     icon: Video,
        // },
        // {
        //     id: "audio",
        //     label: "Audio",
        //     icon: Music,
        // },
        {
            id: "document",
            label: "Documents",
            icon: FileText,
        },
    ];

    return (
        <div className="space-y-4">

            {/* Search + View */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* Search */}
                <div className="relative w-full lg:max-w-md cursor-pointer">
                    <Search
                        size={18}
                        className="
                            pointer-events-none
                            absolute left-3 top-1/2
                            -translate-y-1/2
                            text-slate-400
                            dark:text-zinc-500
                        "
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search media..."
                        className="
                            h-11 w-full
                            rounded-xl
                            border border-blue-100
                            bg-white
                            pl-10 pr-4
                            text-sm text-slate-900
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:border-blue-300
                            focus:ring-4
                            focus:ring-blue-500/10
                            dark:border-white/10
                            dark:bg-white/3
                            dark:text-white
                            dark:placeholder:text-zinc-500
                            dark:focus:border-blue-500/50
                            dark:focus:ring-blue-500/10
                        "
                    />
                </div>

                {/* View Toggle */}
                <div
                    className="
                        flex w-fit items-center
                        rounded-xl
                        border border-blue-100
                        bg-white
                        p-1
                        dark:border-white/10
                        dark:bg-white/3
                    "
                >
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`
                            flex h-9 w-9 items-center justify-center
                            rounded-lg
                            transition
                            cursor-pointer
                            ${
                                viewMode === "grid"
                                    ? `
                                        bg-blue-50
                                        text-blue-600
                                        shadow-sm
                                        dark:bg-blue-500/15
                                        dark:text-blue-400
                                    `
                                    : `
                                        text-slate-400
                                        hover:bg-slate-50
                                        hover:text-slate-700
                                        dark:text-zinc-500
                                        dark:hover:bg-white/5
                                        dark:hover:text-zinc-200
                                    `
                            }
                        `}
                    >
                        <Grid2X2 size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`
                            flex h-9 w-9 items-center justify-center
                            rounded-lg
                            transition
                            cursor-pointer
                            ${
                                viewMode === "list"
                                    ? `
                                        bg-blue-50
                                        text-blue-600
                                        shadow-sm
                                        dark:bg-blue-500/15
                                        dark:text-blue-400
                                    `
                                    : `
                                        text-slate-400
                                        hover:bg-slate-50
                                        hover:text-slate-700
                                        dark:text-zinc-500
                                        dark:hover:bg-white/5
                                        dark:hover:text-zinc-200
                                    `
                            }
                        `}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const active = activeFilter === filter.id;

                    return (
                        <button
                            key={filter.id}
                            type="button"
                            onClick={() => setActiveFilter(filter.id)}
                            className={`
                                inline-flex items-center gap-2
                                rounded-xl
                                border
                                px-3.5 py-2
                                text-sm font-medium
                                transition
                                cursor-pointer
                                ${
                                    active
                                        ? `
                                            border-blue-200
                                            bg-blue-50
                                            text-blue-700
                                            shadow-sm
                                            dark:border-blue-500/20
                                            dark:bg-blue-500/10
                                            dark:text-blue-400
                                        `
                                        : `
                                            border-transparent
                                            bg-slate-100/70
                                            text-slate-600
                                            hover:border-blue-100
                                            hover:bg-blue-50
                                            hover:text-blue-600
                                            dark:bg-white/4
                                            dark:text-zinc-400
                                            dark:hover:border-white/10
                                            dark:hover:bg-white/[0.07]
                                            dark:hover:text-zinc-200
                                        `
                                }
                            `}
                        >
                            <Icon size={16} />
                            {filter.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default MediaFilters;