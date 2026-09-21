import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Upload,} from "lucide-react";
import {
    fetchMedia,
    uploadMedia,
} from "../../store/slices/mediaSlice";

import MediaFilters from "../../components/media/MediaFilters";
import MediaGrid from "../../components/media/MediaGrid";
import MediaUpload from "../../components/media/MediaUpload";

function MediaLibrary() {
    const dispatch = useDispatch();

    const [searchParams, setSearchParams] =
        useSearchParams();

    const {
        items: media,
        loading,
        uploading,
    } = useSelector((state) => state.media);

    // =========================
    // Local State
    // =========================

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [activeFilter, setActiveFilter] =
        useState("all");

    const [viewMode, setViewMode] =
        useState("grid");

    const [showUpload, setShowUpload] =
        useState(false);

    // =========================
    // Fetch Media
    // =========================

    useEffect(() => {
        dispatch(fetchMedia());
    }, [dispatch]);

    // =========================
    // Sync URL Search
    // =========================

    useEffect(() => {
        setSearch(
            searchParams.get("search") || ""
        );
    }, [searchParams]);

    // =========================
    // Search Handler
    // =========================

    const handleSearchChange = (value) => {
        setSearch(value);

        if (value.trim()) {
            setSearchParams({
                search: value.trim(),
            });
        } else {
            setSearchParams({});
        }
    };

    // =========================
    // Filter Media
    // =========================

    const filteredMedia = useMemo(() => {
        return media.filter((item) => {
            const matchesType =
                activeFilter === "all" ||
                item.type === activeFilter;

            const matchesSearch =
                item.originalName
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            return (
                matchesType &&
                matchesSearch
            );
        });
    }, [
        media,
        search,
        activeFilter,
    ]);

    // =========================
    // Upload
    // =========================

    const handleUpload = async (files) => {
        try {
            await dispatch(
                uploadMedia(files)
            ).unwrap();

            setShowUpload(false);
        } catch (error) {
            console.error(
                "Upload failed:",
                error
            );
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Media Library
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Manage and organize your media files.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setShowUpload(true)
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        active:scale-[0.98]
                    "
                >
                    <Upload size={17} />

                    Upload Media
                </button>
            </div>

             {/* Upload Modal */}
            {showUpload && (
                <MediaUpload
                    onUpload={handleUpload}
                    uploading={uploading}
                    onClose={() =>
                        setShowUpload(false)
                    }
                />
            )}

            {/* Filters */}
            <MediaFilters
                search={search}
                setSearch={handleSearchChange}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                viewMode={viewMode}
                setViewMode={setViewMode}
            />

            {/* Media */}
            <MediaGrid
                media={filteredMedia}
                loading={loading}
                viewMode={viewMode}
            />

           
        </div>
    );
}

export default MediaLibrary;