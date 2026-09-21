import { useRef, useState, useEffect } from "react";
import {
    Upload,
    File,
    X,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
    uploadMedia,
    clearUploadError,
} from "../../store/slices/mediaSlice";


function MediaUpload({ onClose }) {

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const {
        uploading,
        uploadError,
    } = useSelector((state) => state.media);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const previewUrl =
        selectedFile && selectedFile.type.startsWith("image/")
            ? URL.createObjectURL(selectedFile)
            : null;

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // =========================
    // File Select
    // =========================

    const handleFileSelect = (file) => {
        if (!file) return;

        // Clear previous validation error
        setValidationError(null);
        setSuccessMessage(null);
        // =========================
        // Allowed File Types
        // =========================

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];

        if (!allowedTypes.includes(file.type)) {
            setValidationError(
                "Only PDF and image files are supported."
            );

            setSelectedFile(null);

            return;
        }

        // =========================
        // Maximum File Size
        // =========================

        const maxSize =
            10 * 1024 * 1024; // 10 MB

        if (file.size > maxSize) {
            setValidationError(
                "File size must be less than 10 MB."
            );

            setSelectedFile(null);

            return;
        }

        // =========================
        // Valid File
        // =========================

        setSelectedFile(file);

        if (uploadError) {
            dispatch(clearUploadError());
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];

        handleFileSelect(file);
    };

    // =========================
    // Drag & Drop
    // =========================

    const handleDrop = (e) => {
        e.preventDefault();

        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];

        handleFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    // =========================
    // Remove Selected File
    // =========================
    const handleRemove = () => {
        setSelectedFile(null);
        setValidationError(null);
        setSuccessMessage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        if (uploadError) {
            dispatch(clearUploadError());
        }
    };

    // =========================
    // Upload
    // =========================

    const handleUpload = async () => {
        if (!selectedFile || uploading) return;

        try {
            await dispatch(
                uploadMedia(selectedFile)
            ).unwrap();
            setSuccessMessage(
                "File uploaded successfully."
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            // Close upload section
            // onClose?.();

        } catch (error) {
            console.error(
                "Upload failed:",
                error
            );
        }
    };

    // =========================
    // Format File Size
    // =========================

    const formatSize = (bytes) => {
        if (!bytes) return "0 KB";

        const units = [
            "Bytes",
            "KB",
            "MB",
            "GB",
        ];

        const index = Math.min(
            Math.floor(
                Math.log(bytes) /
                Math.log(1024)
            ),
            units.length - 1
        );

        const size =
            bytes /
            Math.pow(1024, index);

        return `${size.toFixed(
            index === 0 ? 0 : 1
        )} ${units[index]}`;
    };

    return (
        <div className="relative space-y-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#0c0c0f]">

            {/* Close Button */}
            <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                aria-label="Close upload"
                className="
                    absolute right-4 top-4
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-red-50
                    hover:text-red-500
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    dark:text-zinc-500
                    dark:hover:bg-red-500/10
                    dark:hover:text-red-400
                    cursor-pointer
                "
            >
                <X size={18} />
            </button>

            {/* Header */}
            <div className="pr-12">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Upload Media
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                    Upload a new file to your media library.
                </p>
            </div>

            {/* Dropzone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                    fileInputRef.current?.click()
                }
                className={`
                    group
                    cursor-pointer
                    rounded-2xl
                    border-2
                    border-dashed
                    px-6 py-10
                    text-center
                    transition

                    ${isDragging
                        ? `
                                border-blue-500
                                bg-blue-50
                                dark:border-blue-400
                                dark:bg-blue-500/10
                            `
                        : `
                                border-blue-200
                                bg-blue-50/40
                                hover:border-blue-400
                                hover:bg-blue-50
                                dark:border-white/10
                                dark:bg-white/2
                                dark:hover:border-blue-500/40
                                dark:hover:bg-blue-500/5
                            `
                    }
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleInputChange}
                />

                <div
                    className="
                        mx-auto
                        flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        bg-blue-100
                        text-blue-600
                        transition
                        group-hover:scale-105
                        dark:bg-blue-500/10
                        dark:text-blue-400
                    "
                >
                    <Upload size={25} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                    Drop your file here
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                    or click to browse from your computer
                </p>

                <p className="mt-3 text-xs text-slate-400 dark:text-zinc-500">
                    PDF and image files up to 10 MB are supported
                </p>
            </div>

            {/* Selected File */}
            {selectedFile && (
                <div
                    className="
                        flex flex-col gap-4
                        rounded-xl
                        border border-blue-100
                        bg-blue-50/50
                        p-4
                        sm:flex-row
                        sm:items-center
                        dark:border-blue-500/15
                        dark:bg-blue-500/5
                    "
                >
                    <div
                        className="
        flex h-14 w-14
        shrink-0
        items-center justify-center
        overflow-hidden
        rounded-xl
        bg-white
        shadow-sm
        dark:bg-white/5
    "
                    >
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt={selectedFile.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <File
                                size={21}
                                className="text-blue-600 dark:text-blue-400"
                            />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p
                            className="
                                truncate
                                text-sm font-semibold
                                text-slate-900
                                dark:text-white
                            "
                            title={selectedFile.name}
                        >
                            {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
                            {formatSize(
                                selectedFile.size
                            )}
                        </p>
                    </div>

                    {/* Remove File */}
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={uploading}
                        aria-label="Remove selected file"
                        className="
                            flex h-9 w-9
                            shrink-0
                            items-center justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:text-zinc-500
                            dark:hover:bg-red-500/10
                            dark:hover:text-red-400
                        "
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Upload Button */}
            {selectedFile && (
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="
                        flex w-full
                        items-center justify-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-4 py-3
                        text-sm font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:bg-blue-500
                        dark:hover:bg-blue-600
                    "
                >
                    {uploading ? (
                        <>
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload size={18} />
                            Upload File
                        </>
                    )}
                </button>
            )}

            {/* Success */}
            {successMessage && (
                <div
                    className="
            flex items-center gap-3
            rounded-xl
            border border-green-200
            bg-green-50
            px-4 py-3
            text-sm font-medium
            text-green-700
            dark:border-green-500/20
            dark:bg-green-500/10
            dark:text-green-400
        "
                >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                        ✓
                    </span>

                    {successMessage}
                </div>
            )}
            
            {/* Error */}
            {(validationError || uploadError) && (
                <div
                    className="
                        flex items-center gap-3
                        rounded-xl
                        border border-red-200
                        bg-red-50
                        px-4 py-3
                        text-sm font-medium
                        text-red-700
                        dark:border-red-500/20
                        dark:bg-red-500/10
                        dark:text-red-400
                    "
                >
                    <AlertCircle size={18} />
                    {validationError || uploadError}
                </div>
            )}
        </div>
    );
}

export default MediaUpload;