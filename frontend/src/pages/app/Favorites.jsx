import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Search,
    Grid2X2,
    List,
    Star,
    Image as ImageIcon,
    Video,
    Music,
    FileText,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import {
    fetchMedia,
    toggleFavorite,
} from "../../store/slices/mediaSlice";

const MEDIA_BASE_URL = "http://localhost:5000";

const getMediaUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
        return url;
    }

    return `${MEDIA_BASE_URL}${url}`;
};

const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB"];

    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

    return `${(
        bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const getTypeIcon = (type) => {
    switch (type) {
        case "image":
            return ImageIcon;

        case "video":
            return Video;

        case "audio":
            return Music;

        case "document":
            return FileText;

        default:
            return FileText;
    }
};

function Favorites() {
    const dispatch = useDispatch();

    const {
        items,
        loading,
        error,
        actionLoading,
    } = useSelector((state) => state.media);

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState("list");

    // =========================
    // Fetch Media
    // =========================

    useEffect(() => {
        if (!items.length) {
            dispatch(fetchMedia());
        }
    }, [dispatch, items.length]);

    // =========================
    // Favorite Media
    // =========================

    const favoriteMedia = useMemo(() => {
        return items
            .filter((item) => item.isFavorite)
            .filter((item) =>
                item.originalName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
    }, [items, search]);

    // =========================
    // Toggle Favorite
    // =========================

    const handleToggleFavorite = (mediaId) => {
        dispatch(toggleFavorite(mediaId));
    };

    // =========================
    // Loading
    // =========================

    if (loading && !items.length) {
        return (
            <div className="space-y-6">

                <div>
                    <div className="h-8 w-40 animate-pulse rounded-lg bg-blue-100 dark:bg-white/10" />

                    <div className="mt-2 h-4 w-64 animate-pulse rounded bg-blue-100 dark:bg-white/10" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
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
                            <div className="aspect-[4/3] animate-pulse bg-blue-50 dark:bg-white/10" />

                            <div className="space-y-3 p-4">
                                <div className="h-4 w-3/4 animate-pulse rounded bg-blue-50 dark:bg-white/10" />

                                <div className="h-3 w-1/2 animate-pulse rounded bg-blue-50 dark:bg-white/10" />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        );
    }

    // =========================
    // Error
    // =========================

    if (error && !items.length) {
        return (
            <div className="flex min-h-[420px] items-center justify-center">

                <div
                    className="
                        w-full max-w-md
                        rounded-2xl
                        border border-red-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                        dark:border-red-500/20
                        dark:bg-white/[0.03]
                    "
                >

                    <div
                        className="
                            mx-auto
                            flex h-14 w-14
                            items-center justify-center
                            rounded-2xl
                            bg-red-50
                            text-red-500
                            dark:bg-red-500/10
                            dark:text-red-400
                        "
                    >
                        <AlertCircle size={25} />
                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                        Failed to load favorites
                    </h2>

                    <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                        {error}
                    </p>

                    <button
                        onClick={() => dispatch(fetchMedia())}
                        className="
                            mt-5
                            inline-flex items-center gap-2
                            rounded-xl
                            bg-blue-600
                            px-4 py-2.5
                            text-sm font-semibold
                            text-white
                            transition
                            hover:bg-blue-700
                            active:scale-[0.98]
                            dark:bg-blue-500
                            dark:hover:bg-blue-600
                        "
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* =========================
                Header
            ========================= */}

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>
                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex h-11 w-11
                                items-center justify-center
                                rounded-xl
                                bg-amber-50
                                text-amber-500
                                dark:bg-amber-500/10
                                dark:text-amber-400
                            "
                        >
                            <Star
                                size={21}
                                fill="currentColor"
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Favorites
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                                Your starred media files
                            </p>
                        </div>

                    </div>
                </div>

                <div className="flex items-center gap-3">

                    {/* Search */}

                    <div className="relative flex-1 lg:w-72">

                        <Search
                            size={17}
                            className="
                                absolute left-3 top-1/2
                                -translate-y-1/2
                                text-slate-400
                                dark:text-zinc-500
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search favorites..."
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
                                dark:bg-white/[0.03]
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
                            flex h-11 items-center
                            rounded-xl
                            border border-blue-100
                            bg-white
                            p-1
                            dark:border-white/10
                            dark:bg-white/[0.03]
                        "
                    >

                        <button
                            onClick={() => setViewMode("grid")}
                            className={`
                                flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                transition
                                ${
                                    viewMode === "grid"
                                        ? `
                                            bg-blue-50
                                            text-blue-600
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
                            title="Grid view"
                        >
                            <Grid2X2 size={17} />
                        </button>

                        <button
                            onClick={() => setViewMode("list")}
                            className={`
                                flex h-9 w-9
                                items-center justify-center
                                rounded-lg
                                transition
                                ${
                                    viewMode === "list"
                                        ? `
                                            bg-blue-50
                                            text-blue-600
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
                            title="List view"
                        >
                            <List size={18} />
                        </button>

                    </div>

                </div>

            </div>

            {/* Result Count */}

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500 dark:text-zinc-400">
                    {favoriteMedia.length}{" "}
                    {favoriteMedia.length === 1
                        ? "favorite"
                        : "favorites"}
                </p>

                {actionLoading && (
                    <div className="flex items-center gap-2 text-xs text-blue-500 dark:text-blue-400">
                        <RefreshCw
                            size={14}
                            className="animate-spin"
                        />
                        Updating...
                    </div>
                )}

            </div>

            {/* Empty State */}

            {!favoriteMedia.length ? (
                <div
                    className="
                        flex min-h-[380px]
                        flex-col items-center justify-center
                        rounded-2xl
                        border border-dashed border-blue-200
                        bg-white
                        px-6
                        text-center
                        dark:border-white/10
                        dark:bg-white/[0.03]
                    "
                >

                    <div
                        className="
                            flex h-16 w-16
                            items-center justify-center
                            rounded-2xl
                            bg-amber-50
                            text-amber-500
                            dark:bg-amber-500/10
                            dark:text-amber-400
                        "
                    >
                        <Star
                            size={28}
                            fill="currentColor"
                        />
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                        {search
                            ? "No favorites found"
                            : "No favorite media yet"}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-zinc-400">
                        {search
                            ? "Try searching with a different file name."
                            : "Star your favorite images, videos, audio files, or documents and they will appear here."}
                    </p>

                </div>
            ) : viewMode === "grid" ? (

                /* =========================
                   Grid View
                ========================= */

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

                    {favoriteMedia.map((media) => {

                        const Icon =
                            getTypeIcon(media.type);

                        return (
                            <div
                                key={media._id}
                                className="
                                    group
                                    overflow-hidden
                                    rounded-2xl
                                    border border-blue-100
                                    bg-white
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-blue-200
                                    hover:shadow-lg
                                    dark:border-white/10
                                    dark:bg-white/[0.03]
                                    dark:hover:border-blue-500/20
                                    dark:hover:bg-white/[0.045]
                                "
                            >

                                {/* Preview */}

                                <div
                                    className="
                                        relative
                                        aspect-[4/3]
                                        overflow-hidden
                                        bg-blue-50/70
                                        dark:bg-blue-500/[0.06]
                                    "
                                >

                                    {media.type === "image" &&
                                    media.url ? (

                                        <img
                                            src={getMediaUrl(media.url)}
                                            alt={media.originalName}
                                            className="
                                                h-full w-full
                                                object-cover
                                                transition duration-500
                                                group-hover:scale-105
                                            "
                                        />

                                    ) : media.type === "video" &&
                                      media.url ? (

                                        <video
                                            src={getMediaUrl(media.url)}
                                            className="h-full w-full object-cover"
                                            muted
                                            preload="metadata"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center">

                                            <div
                                                className="
                                                    flex h-16 w-16
                                                    items-center justify-center
                                                    rounded-2xl
                                                    bg-white
                                                    text-blue-500
                                                    shadow-sm
                                                    dark:bg-white/5
                                                    dark:text-blue-400
                                                "
                                            >
                                                <Icon size={30} />
                                            </div>

                                        </div>

                                    )}

                                    {/* Favorite Button */}

                                    <button
                                        onClick={() =>
                                            handleToggleFavorite(
                                                media._id
                                            )
                                        }
                                        disabled={actionLoading}
                                        className="
                                            absolute right-3 top-3
                                            flex h-9 w-9
                                            items-center justify-center
                                            rounded-xl
                                            bg-white/90
                                            text-amber-500
                                            shadow-sm
                                            backdrop-blur
                                            transition
                                            hover:scale-105
                                            hover:bg-amber-50
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            dark:bg-black/60
                                            dark:hover:bg-amber-500/20
                                        "
                                        title="Remove from favorites"
                                    >
                                        <Star
                                            size={17}
                                            fill="currentColor"
                                        />
                                    </button>

                                </div>

                                {/* Info */}

                                <div className="p-4">

                                    <h3
                                        className="
                                            truncate
                                            text-sm font-semibold
                                            text-slate-900
                                            dark:text-white
                                        "
                                        title={media.originalName}
                                    >
                                        {media.originalName}
                                    </h3>

                                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">

                                        <span className="capitalize">
                                            {media.type}
                                        </span>

                                        <span>
                                            {formatFileSize(
                                                media.size
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            ) : (

                /* =========================
                   List View
                ========================= */

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border border-blue-100
                        bg-white
                        dark:border-white/10
                        dark:bg-white/[0.03]
                    "
                >

                    <div className="divide-y divide-blue-50 dark:divide-white/5">

                        {favoriteMedia.map((media) => {

                            const Icon =
                                getTypeIcon(media.type);

                            return (
                                <div
                                    key={media._id}
                                    className="
                                        flex items-center gap-4
                                        p-4
                                        transition
                                        hover:bg-blue-50/50
                                        dark:hover:bg-white/[0.03]
                                    "
                                >

                                    {/* Thumbnail */}

                                    <div
                                        className="
                                            h-16 w-20
                                            shrink-0
                                            overflow-hidden
                                            rounded-xl
                                            bg-blue-50
                                            dark:bg-blue-500/[0.06]
                                        "
                                    >

                                        {media.type === "image" &&
                                        media.url ? (

                                            <img
                                                src={getMediaUrl(media.url)}
                                                alt={media.originalName}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : media.type === "video" &&
                                          media.url ? (

                                            <video
                                                src={getMediaUrl(media.url)}
                                                className="h-full w-full object-cover"
                                                muted
                                                preload="metadata"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-blue-500 dark:text-blue-400">
                                                <Icon size={23} />
                                            </div>

                                        )}

                                    </div>

                                    {/* Name */}

                                    <div className="min-w-0 flex-1">

                                        <h3
                                            className="
                                                truncate
                                                text-sm font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                            title={media.originalName}
                                        >
                                            {media.originalName}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                                            <span className="capitalize">
                                                {media.type}
                                            </span>
                                            {" • "}
                                            {formatFileSize(
                                                media.size
                                            )}
                                        </p>

                                    </div>

                                    {/* Favorite */}

                                    <button
                                        onClick={() =>
                                            handleToggleFavorite(
                                                media._id
                                            )
                                        }
                                        disabled={actionLoading}
                                        className="
                                            flex h-9 w-9
                                            shrink-0
                                            items-center justify-center
                                            rounded-xl
                                            text-amber-500
                                            transition
                                            hover:bg-amber-50
                                            hover:text-amber-600
                                            disabled:opacity-50
                                            dark:hover:bg-amber-500/10
                                            dark:hover:text-amber-400
                                        "
                                        title="Remove from favorites"
                                    >
                                        <Star
                                            size={18}
                                            fill="currentColor"
                                        />
                                    </button>

                                </div>
                            );
                        })}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Favorites;