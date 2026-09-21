import { useEffect, useState } from "react";
import {
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Star,
    MoreHorizontal,
    Pencil,
    Trash2,
    Sparkles,
    ArrowUpRight,
    LoaderCircle,
    Check,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    toggleFavorite,
    moveToTrash,
    renameMedia,
} from "../../store/slices/mediaSlice";

const MEDIA_BASE_URL = "http://localhost:5000";

const getMediaUrl = (url) => {
    if (!url) return "";

    if (url.startsWith("http")) {
        return url;
    }

    return `${MEDIA_BASE_URL}${url}`;
};

const formatSize = (bytes) => {
    if (!bytes) return "0 KB";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

    const size = bytes / Math.pow(1024, index);

    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatDate = (date) => {
    if (!date) return "Unknown date";

    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const FileIcon = ({ type, size = 30 }) => {
    if (type === "image") {
        return <ImageIcon size={size} />;
    }

    if (type === "video") {
        return <Video size={size} />;
    }

    if (type === "audio") {
        return <Music size={size} />;
    }

    return <FileText size={size} />;
};

function MediaCard({ media, viewMode = "grid" }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { actionLoading } = useSelector(
        (state) => state.media
    );
    const aiStatus = media.aiProcessing?.status;

    const isProcessing =
        aiStatus === "pending" ||
        aiStatus === "processing";

    const isFailed =
        aiStatus === "failed";

    const isReady =
        aiStatus === "completed";

    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState(
        media.originalName || ""
    );

    useEffect(() => {
        setNewName(media.originalName || "");
    }, [media.originalName]);

    const handleFavorite = async () => {
        await dispatch(toggleFavorite(media._id));
    };

    const handleTrash = async () => {
        setMenuOpen(false);

        await dispatch(moveToTrash(media._id));
    };

    const handleRename = async () => {
        const trimmedName = newName.trim();

        if (!trimmedName) return;

        if (trimmedName === media.originalName) {
            setEditing(false);
            return;
        }

        try {
            // console.log("BEFORE DISPATCH:", {
            //     mediaId: media._id,
            //     originalName: trimmedName,
            // });

            const result = await dispatch(
                renameMedia({
                    mediaId: media._id,
                    originalName: trimmedName,
                })
            ).unwrap();

            // console.log("RENAME RESULT:", result);

            setEditing(false);

        } catch (error) {
            console.error("RENAME ERROR:", error);
        }
    };

    const handleAskAI = () => {

        if (!isReady) {
            return;
        }

        navigate(
            `/chat?mediaId=${media._id}`
        );
    };

    const mediaUrl = getMediaUrl(media.url);

    const isLoading = actionLoading;

    // =========================
    // LIST VIEW
    // =========================

    if (viewMode === "list") {
        return (
            <div
                className="
                    group
                    relative
                    flex flex-col gap-4
                    rounded-2xl
                    border border-blue-100
                    bg-white
                    p-4
                    shadow-sm
                    transition
                    hover:border-blue-200
                    hover:shadow-md
                    sm:flex-row sm:items-center
                    dark:border-white/10
                    dark:bg-white/3
                    dark:hover:border-blue-500/20
                    dark:hover:bg-white/4.5
                "
            >
                {/* Thumbnail */}
                <div
                    className="
                        flex h-20 w-20
                        shrink-0 items-center justify-center
                        overflow-hidden
                        rounded-xl
                        border border-blue-100
                        bg-blue-50/70
                        dark:border-white/10
                        dark:bg-blue-500/10
                    "
                >
                    {media.type === "image" ? (
                        <img
                            src={mediaUrl}
                            alt={media.originalName}
                            className="h-full w-full object-cover"
                        />
                    ) : media.type === "video" ? (
                        <video
                            src={mediaUrl}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="text-blue-500 dark:text-blue-400">
                            <FileIcon type={media.type} />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    {editing ? (
                        <div className="flex max-w-lg items-center gap-2">
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) =>
                                    setNewName(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRename();
                                    }

                                    if (e.key === "Escape") {
                                        setEditing(false);
                                        setNewName(
                                            media.originalName
                                        );
                                    }
                                }}
                                autoFocus
                                className="
                                    h-9 w-full
                                    rounded-lg
                                    border border-blue-200
                                    bg-white
                                    px-3
                                    text-sm text-slate-900
                                    outline-none
                                    focus:border-blue-400
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                    dark:border-white/10
                                    dark:bg-white/5
                                    dark:text-white
                                "
                            />

                            <button
                                type="button"
                                onClick={handleRename}
                                className="
                                    flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    rounded-lg
                                    bg-blue-600
                                    text-white
                                    hover:bg-blue-700
                                "
                            >
                                <Check size={16} />
                            </button>
                        </div>
                    ) : (
                        <h3
                            className="
                                truncate
                                text-sm font-semibold
                                text-slate-900
                                dark:text-white
                                cursor-pointer
                            "
                            onClick={() => navigate(`/media/${media._id}`)}
                            title={media.originalName}
                        >
                            {media.originalName}

                        </h3>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                        <span>{formatSize(media.size)}</span>

                        <span className="text-slate-300 dark:text-zinc-700">
                            •
                        </span>

                        <span>{formatDate(media.createdAt)}</span>

                        <span
                            className="
                                rounded-md
                                bg-blue-50
                                px-2 py-1
                                font-medium
                                capitalize
                                text-blue-600
                                dark:bg-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            {media.type}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">

                    <button
                        type="button"
                        onClick={handleFavorite}
                        disabled={isLoading}
                        className={`
                            flex h-9 w-9 items-center justify-center
                            rounded-lg
                            transition
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            ${media.isFavorite
                                ? `
                                        bg-amber-50
                                        text-amber-500
                                        dark:bg-amber-500/10
                                        dark:text-amber-400
                                    `
                                : `
                                        text-slate-400
                                        hover:bg-amber-50
                                        hover:text-amber-500
                                        dark:text-zinc-500
                                        dark:hover:bg-amber-500/10
                                        dark:hover:text-amber-400
                                    `
                            }
                        `}
                    >
                        <Star
                            size={17}
                            fill={
                                media.isFavorite
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>

                    <button

                        type="button"
                        onClick={handleAskAI}
                        disabled={!isReady}
                        className="
                            inline-flex items-center gap-2
                            rounded-lg
                            bg-violet-50
                            px-3 py-2
                            text-xs font-semibold
                            text-violet-600
                            transition
                            hover:bg-violet-100
                            dark:bg-violet-500/10
                            dark:text-violet-400
                            dark:hover:bg-violet-500/15
                        "
                    >
                        {isProcessing ? (
                            <>
                                <LoaderCircle
                                    size={15}
                                    className="animate-spin"
                                />

                                {aiStatus === "pending"
                                    ? "Waiting for AI..."
                                    : "Processing..."}
                            </>
                        ) : isFailed ? (
                            <>
                                <Sparkles size={15} />
                                Processing failed
                            </>
                        ) : (
                            <>
                                <Sparkles size={15} />
                                Ask AI
                                <ArrowUpRight size={14} />
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() =>
                                setMenuOpen((prev) => !prev)
                            }
                            className="
                                flex h-9 w-9 items-center justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-slate-100
                                hover:text-slate-700
                                dark:text-zinc-500
                                dark:hover:bg-white/5
                                dark:hover:text-zinc-200
                            "
                        >
                            <MoreHorizontal size={18} />
                        </button>

                        {menuOpen && (
                            <ActionMenu
                                onRename={() => {
                                    setMenuOpen(false);
                                    setEditing(true);
                                }}
                                onTrash={handleTrash}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // =========================
    // GRID VIEW
    // =========================

    return (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border border-blue-100
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:shadow-lg
                dark:border-white/10
                dark:bg-white/3
                dark:hover:border-blue-500/20
                dark:hover:bg-white/4.5
            "
        >
            {/* Preview */}
            <div
                className="
                    relative
                    aspect-4/3
                    overflow-hidden
                    bg-blue-50/70
                    dark:bg-blue-500/6
                "
            >
                {media.type === "image" ? (
                    <img
                        src={mediaUrl}
                        alt={media.originalName}
                        onClick={() => navigate(`/media/${media._id}`)}
                        className="
                            h-full w-full
                            object-cover
                            transition duration-500
                            group-hover:scale-[1.03]
                            cursor-pointer
                        "
                    />
                ) : media.type === "video" ? (
                    <video
                        src={mediaUrl}
                        className="h-full w-full object-cover"
                        controls={false}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div
                            onClick={() => navigate(`/media/${media._id}`)}
                            className="
                                flex h-16 w-16
                                items-center justify-center
                                rounded-2xl
                                bg-white
                                text-blue-500
                                shadow-sm
                                dark:bg-white/5
                                dark:text-blue-400
                                cursor-pointer
                            "
                        >
                            <FileIcon
                                type={media.type}
                                size={30}
                            />
                        </div>
                    </div>
                )}

                {/* Top badges */}
                {/* <div className="absolute left-3 top-3">
                    <span
                        className="
                            inline-flex items-center gap-1.5
                            rounded-lg
                            bg-blue-600/90
                            px-2.5 py-1
                            text-[11px]
                            font-semibold
                            text-white
                            shadow-sm
                            backdrop-blur
                            dark:bg-blue-500/90
                        "
                    >
                        <Sparkles size={12} />
                        AI Ready
                    </span>
                </div> */}

                {/* Favorite */}
                <button
                    type="button"
                    onClick={handleFavorite}
                    disabled={isLoading}
                    className={`
                        absolute right-3 bottom-3
                        flex h-9 w-9
                        items-center justify-center
                        rounded-xl
                        backdrop-blur-md
                        shadow-sm
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        ${media.isFavorite
                            ? `
                                    bg-amber-50
                                    text-amber-500
                                    dark:bg-amber-500/20
                                    dark:text-amber-400
                                `
                            : `
                                    bg-white/90
                                    text-slate-400
                                    hover:text-amber-500
                                    dark:bg-black/40
                                    dark:text-zinc-300
                                    dark:hover:text-amber-400
                                `
                        }
                    `}
                >
                    <Star
                        size={17}
                        fill={
                            media.isFavorite
                                ? "currentColor"
                                : "none"
                        }
                    />
                </button>

                {/* Menu */}
                <div className="absolute top-3 right-3">
                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen((prev) => !prev)
                        }
                        className="
                            flex h-9 w-9
                            items-center justify-center
                            rounded-xl
                            bg-white/90
                            text-slate-500
                            shadow-sm
                            backdrop-blur
                            transition
                            hover:text-slate-900
                            dark:bg-black/50
                            dark:text-zinc-300
                            dark:hover:text-white
                        "
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {menuOpen && (
                        <ActionMenu
                            onRename={() => {
                                setMenuOpen(false);
                                setEditing(true);
                            }}
                            onTrash={handleTrash}
                        />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">

                {editing ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) =>
                                setNewName(e.target.value)
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRename();
                                }

                                if (e.key === "Escape") {
                                    setEditing(false);
                                    setNewName(
                                        media.originalName
                                    );
                                }
                            }}
                            autoFocus
                            className="
                                h-9 min-w-0 flex-1
                                rounded-lg
                                border border-blue-200
                                bg-white
                                px-3
                                text-sm text-slate-900
                                outline-none
                                focus:border-blue-400
                                focus:ring-4
                                focus:ring-blue-500/10
                                dark:border-white/10
                                dark:bg-white/5
                                dark:text-white
                            "
                        />

                        <button
                            type="button"
                            onClick={handleRename}
                            disabled={isLoading}
                            className="
                                flex h-9 w-9 shrink-0
                                items-center justify-center
                                rounded-lg
                                bg-blue-600
                                text-white
                                hover:bg-blue-700
                                disabled:opacity-50
                            "
                        >
                            {isLoading ? (
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                <Check size={16} />
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3
                                className="
                                    truncate
                                    text-sm font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                                title={media.originalName}
                            >
                                <div
                                    onClick={() => navigate(`/media/${media._id}`)}
                                    className="cursor-pointer"
                                >
                                    {media.originalName}
                                </div>
                            </h3>

                            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                {formatSize(media.size)} •{" "}
                                {formatDate(media.createdAt)}
                            </p>
                        </div>

                        <span
                            className="
                                shrink-0
                                rounded-md
                                bg-blue-50
                                px-2 py-1
                                text-[10px]
                                font-semibold
                                capitalize
                                text-blue-600
                                dark:bg-blue-500/10
                                dark:text-blue-400
                            "
                        >
                            {media.type}
                        </span>
                    </div>
                )}

                {/* Ask AI */}
                <button
                    type="button"
                    onClick={handleAskAI}
                    disabled={!isReady}
                    className="
                        mt-4
                        flex w-full
                        items-center justify-center gap-2
                        rounded-xl
                        border border-violet-100
                        bg-violet-50
                        px-3 py-2.5
                        text-xs font-semibold
                        text-violet-600
                        transition
                        hover:bg-violet-100
                        dark:border-violet-500/15
                        dark:bg-violet-500/10
                        dark:text-violet-400
                        dark:hover:bg-violet-500/15
                    "
                >
                    {isProcessing ? (
                        <>
                            <LoaderCircle
                                size={15}
                                className="animate-spin"
                            />

                            {aiStatus === "pending"
                                ? "Waiting for AI..."
                                : "Processing..."}
                        </>
                    ) : isFailed ? (
                        <>
                            <Sparkles size={15} />
                            Processing failed
                        </>
                    ) : (
                        <>
                            <Sparkles size={15} />
                            Ask AI about this file
                            <ArrowUpRight size={14} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function ActionMenu({ onRename, onTrash }) {
    return (
        <div
            className="
                absolute right-0
                z-40 mt-2
                w-44
                overflow-hidden
                rounded-xl
                border border-blue-100
                bg-white
                p-1
                shadow-xl
                dark:border-white/10
                dark:bg-zinc-900
            "
        >
            <button
                type="button"
                onClick={onRename}
                className="
                    flex w-full items-center gap-2
                    rounded-lg
                    px-3 py-2
                    text-sm
                    text-slate-700
                    transition
                    hover:bg-blue-50
                    hover:text-blue-600
                    dark:text-zinc-300
                    dark:hover:bg-blue-500/10
                    dark:hover:text-blue-400
                "
            >
                <Pencil size={15} />
                Rename
            </button>

            <button
                type="button"
                onClick={onTrash}
                className="
                    flex w-full items-center gap-2
                    rounded-lg
                    px-3 py-2
                    text-sm
                    text-red-600
                    transition
                    hover:bg-red-50
                    dark:text-red-400
                    dark:hover:bg-red-500/10
                "
            >
                <Trash2 size={15} />
                Move to trash
            </button>
        </div>
    );
}

export default MediaCard;