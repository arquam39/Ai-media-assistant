import { useEffect, useState } from "react";

import {
    Trash2,
    RotateCcw,
    AlertTriangle,
    LoaderCircle,
    X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
    fetchTrash,
    restoreMedia,
    permanentlyDeleteMedia,
} from "../../store/slices/mediaSlice";


function Trash() {

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    // FIX:
    // Keep track of the exact media being deleted
    const [selectedMediaId, setSelectedMediaId] =
        useState(null);

    const {
        trashItems,
        trashLoading,
        trashError,
        actionLoading,
    } = useSelector(
        (state) => state.media
    );


    useEffect(() => {
        dispatch(fetchTrash());
    }, [dispatch]);


    const handleRestore = async (id) => {

        try {

            await dispatch(
                restoreMedia(id)
            ).unwrap();

        } catch (error) {

            console.error(
                "Restore failed:",
                error
            );

        }
    };


    const handlePermanentDelete = async () => {

        if (!selectedMediaId) {
            return;
        }

        try {

            setLoading(true);

            await dispatch(
                permanentlyDeleteMedia(
                    selectedMediaId
                )
            ).unwrap();

            setSelectedMediaId(null);

        } catch (error) {

            console.error(
                "Permanent delete failed:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <div className="flex items-center gap-3">

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
                        <Trash2 size={20} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Trash
                        </h1>

                        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                            Deleted files are kept here until permanently removed.
                        </p>
                    </div>

                </div>
            </div>


            {/* Error */}

            {trashError && (
                <div
                    className="
                        flex items-center gap-3
                        rounded-xl
                        border border-red-200
                        bg-red-50
                        p-4
                        text-sm text-red-700
                        dark:border-red-500/20
                        dark:bg-red-500/10
                        dark:text-red-400
                    "
                >
                    <AlertTriangle size={18} />
                    {trashError}
                </div>
            )}


            {/* Loading */}

            {trashLoading && (
                <div className="space-y-3">

                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="
                                h-20
                                animate-pulse
                                rounded-2xl
                                border border-blue-100
                                bg-blue-50
                                dark:border-white/10
                                dark:bg-white/4
                            "
                        />
                    ))}

                </div>
            )}


            {/* Empty */}

            {!trashLoading &&
                trashItems.length === 0 && (
                    <div
                        className="
                            flex min-h-100
                            flex-col items-center justify-center
                            rounded-2xl
                            border border-dashed
                            border-blue-200
                            bg-white
                            dark:border-white/10
                            dark:bg-white/3
                        "
                    >

                        <div
                            className="
                                flex h-16 w-16
                                items-center justify-center
                                rounded-2xl
                                bg-red-50
                                text-red-400
                                dark:bg-red-500/10
                                dark:text-red-400
                            "
                        >
                            <Trash2 size={28} />
                        </div>

                        <h2 className="mt-5 font-semibold text-slate-900 dark:text-white">
                            Trash is empty
                        </h2>

                        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                            Deleted files will appear here.
                        </p>

                    </div>
                )}


            {/* Trash Items */}

            {!trashLoading &&
                trashItems.length > 0 && (
                    <div className="space-y-3">

                        {trashItems.map((media) => (

                            <div
                                key={media._id}
                                className="
                                    flex flex-col gap-4
                                    rounded-2xl
                                    border border-blue-100
                                    bg-white
                                    p-4
                                    shadow-sm
                                    transition
                                    hover:border-blue-200
                                    hover:shadow-md
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    dark:border-white/10
                                    dark:bg-white/3
                                    dark:hover:border-blue-500/20
                                "
                            >

                                <div className="flex min-w-0 items-center gap-4">

                                    {/* Thumbnail */}

                                    <div
                                        className="
                                            h-14 w-14
                                            shrink-0
                                            overflow-hidden
                                            rounded-xl
                                            bg-blue-50
                                            dark:bg-blue-500/6
                                        "
                                    >

                                        {media.type === "image" ? (

                                            <img
                                                src={media.url}
                                                alt={media.originalName}
                                                className="h-full w-full object-cover"
                                            />

                                        ) : (

                                            <div className="flex h-full items-center justify-center text-blue-400 dark:text-blue-500">
                                                <Trash2 size={20} />
                                            </div>

                                        )}

                                    </div>


                                    {/* Info */}

                                    <div className="min-w-0">

                                        <p
                                            className="
                                                truncate
                                                text-sm font-semibold
                                                text-slate-900
                                                dark:text-white
                                            "
                                        >
                                            {media.originalName}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">

                                            Deleted{" "}

                                            {media.deletedAt
                                                ? new Date(
                                                    media.deletedAt
                                                ).toLocaleDateString()
                                                : ""}

                                        </p>

                                    </div>

                                </div>


                                {/* Actions */}

                                <div className="flex items-center gap-2">

                                    {/* Restore */}

                                    <button
                                        disabled={actionLoading}
                                        onClick={() =>
                                            handleRestore(
                                                media._id
                                            )
                                        }
                                        className="
                                            inline-flex
                                            items-center gap-2
                                            rounded-xl
                                            border border-blue-100
                                            bg-blue-50
                                            px-3 py-2
                                            text-sm font-semibold
                                            text-blue-600
                                            transition
                                            hover:bg-blue-100
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            dark:border-blue-500/20
                                            dark:bg-blue-500/10
                                            dark:text-blue-400
                                            dark:hover:bg-blue-500/15
                                        "
                                    >

                                        {actionLoading ? (

                                            <LoaderCircle
                                                size={16}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <RotateCcw
                                                size={16}
                                            />

                                        )}

                                        Restore

                                    </button>


                                    {/* Delete */}

                                    <button
                                        disabled={actionLoading}
                                        onClick={() =>
                                            setSelectedMediaId(
                                                media._id
                                            )
                                        }
                                        className="
                                            inline-flex
                                            items-center gap-2
                                            rounded-xl
                                            bg-red-500
                                            px-3 py-2
                                            text-sm font-semibold
                                            text-white
                                            transition
                                            hover:bg-red-600
                                            disabled:cursor-not-allowed
                                            disabled:opacity-50
                                            dark:bg-red-500
                                            dark:hover:bg-red-600
                                        "
                                    >

                                        <Trash2 size={16} />

                                        Delete

                                    </button>


                                </div>

                            </div>

                        ))}

                    </div>
                )}


            {/* ==================================================
                Delete Confirmation Modal
            ================================================== */}

            {selectedMediaId && (

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
                        !loading &&
                        setSelectedMediaId(null)
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
                                    setSelectedMediaId(
                                        null
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
                                Delete from MediaAI?
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">
                                Are you sure you want to Delete Media?
                                You can not Restore anything after delete.
                            </p>

                        </div>


                        {/* Actions */}

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedMediaId(
                                        null
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
                                    dark:bg-white/3
                                    dark:text-zinc-200
                                    dark:hover:bg-white/5
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handlePermanentDelete
                                }
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

                                        Deleting...
                                    </>

                                ) : (

                                    <>
                                        <Trash2
                                            size={17}
                                        />

                                        Delete
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Trash;
