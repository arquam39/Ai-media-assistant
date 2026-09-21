import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Download,
    FileText,
    Sparkles,
    Image as ImageIcon,
    Music,
    Video,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchSingleMedia,
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
    if (!bytes) return "0 Bytes";

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];

    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

    return `${(
        bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
};

const getIcon = (type) => {
    switch (type) {
        case "image":
            return ImageIcon;

        case "video":
            return Video;

        case "audio":
            return Music;

        default:
            return FileText;
    }
};

function MediaDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        currentMedia,
        loading,
        error,
    } = useSelector(
        (state) => state.media
    );

    useEffect(() => {
        if (id) {
            dispatch(fetchSingleMedia(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 dark:border-white/10 dark:border-t-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-500/20 dark:bg-red-500/10">
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/media")}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Media
                    </button>
                </div>
            </div>
        );
    }

    if (!currentMedia) {
        return null;
    }

    const mediaUrl = getMediaUrl(
        currentMedia.url
    );

    const Icon = getIcon(
        currentMedia.type
    );

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex items-center justify-between gap-4">

                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.06]"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                <a
                    href={mediaUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Download size={17} />
                    Download
                </a>

            </div>

            {/* Main */}

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

                {/* Preview */}

                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">

                    <div className="flex min-h-[500px] items-center justify-center bg-blue-50/50 p-6 dark:bg-blue-500/[0.04]">

                        {/* Image */}

                        {currentMedia.type === "image" && (
                            <img
                                src={mediaUrl}
                                alt={currentMedia.originalName}
                                className="max-h-[700px] max-w-full rounded-xl object-contain shadow-lg"
                            />
                        )}

                        {/* Video */}

                        {currentMedia.type === "video" && (
                            <video
                                src={mediaUrl}
                                controls
                                className="max-h-[700px] max-w-full rounded-xl shadow-lg"
                            />
                        )}

                        {/* Other files */}

                        {currentMedia.type !== "image" &&
                            currentMedia.type !== "video" && (
                                <div className="flex flex-col items-center justify-center text-center">

                                    <div className="mb-4 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                                        <Icon
                                            size={48}
                                            className="text-blue-500 dark:text-blue-400"
                                        />
                                    </div>

                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        Preview unavailable
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                        This file type cannot be previewed
                                    </p>

                                </div>
                            )}

                    </div>

                </div>

                {/* Information */}

                <div className="space-y-5">

                    {/* File Information */}

                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.03]">

                        <div className="mb-6 flex items-start gap-3">

                            <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                <Icon size={20} />
                            </div>

                            <div className="min-w-0">

                                <h1 className="break-words text-lg font-semibold text-slate-900 dark:text-white">
                                    {currentMedia.originalName}
                                </h1>

                                <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">
                                    {currentMedia.mimeType}
                                </p>

                            </div>

                        </div>

                        <div className="space-y-5">

                            {/* File Size */}

                            <div>
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                    File size
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {formatFileSize(
                                        currentMedia.size
                                    )}
                                </p>
                            </div>

                            {/* Type */}

                            <div>
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                    Type
                                </p>

                                <span className="mt-2 inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                                    {currentMedia.type}
                                </span>
                            </div>

                            {/* Uploaded */}

                            <div>
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                    Uploaded
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                                    {new Date(
                                        currentMedia.createdAt
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }
                                    )}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Ask AI */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/chat?mediaId=${currentMedia._id}`
                            )
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
                    >
                        <Sparkles size={17} />
                        Ask AI About This File
                    </button>

                </div>

            </div>

        </div>
    );
}

export default MediaDetails;