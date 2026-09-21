import { apiClient } from "./apiClient";

const handleResponse = async (
    response,
    defaultMessage
) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || defaultMessage
        );
    }

    return data;
};


// =========================
// Get All Media
// =========================

export const getMedia = async () => {
    const response = await apiClient(
        "/media",
        {
            method: "GET",
        }
    );

    return handleResponse(
        response,
        "Failed to fetch media"
    );
};


// =========================
// Get Trash
// =========================

export const getTrash = async () => {
    const response = await apiClient(
        "/media/trash",
        {
            method: "GET",
        }
    );

    return handleResponse(
        response,
        "Failed to fetch trash"
    );
};


// =========================
// Upload Media
// =========================

export const uploadMedia = async (file) => {
    const formData = new FormData();

    formData.append(
        "file",
        file
    );

    const response = await apiClient(
        "/media/upload",
        {
            method: "POST",

            body: formData,
        }
    );

    return handleResponse(
        response,
        "Failed to upload media"
    );
};


// =========================
// Get Single Media
// =========================

export const getSingleMedia = async (
    mediaId
) => {
    const response = await apiClient(
        `/media/${mediaId}`,
        {
            method: "GET",
        }
    );

    return handleResponse(
        response,
        "Failed to fetch media"
    );
};


// =========================
// Rename Media
// =========================

export const renameMedia = async (
    mediaId,
    originalName
) => {
    const response = await apiClient(
        `/media/${mediaId}`,
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                name: originalName.trim(),
            }),
        }
    );

    return handleResponse(
        response,
        "Failed to rename media"
    );
};

// =========================
// Toggle Favorite
// =========================

export const toggleFavorite = async (
    mediaId
) => {
    const response = await apiClient(
        `/media/${mediaId}/favorite`,
        {
            method: "POST",
        }
    );

    return handleResponse(
        response,
        "Failed to update favorite"
    );
};


// =========================
// Move To Trash
// =========================

export const moveToTrash = async (
    mediaId
) => {
    const response = await apiClient(
        `/media/${mediaId}`,
        {
            method: "DELETE",
        }
    );

    return handleResponse(
        response,
        "Failed to move media to trash"
    );
};


// =========================
// Restore Media
// =========================

export const restoreMedia = async (
    mediaId
) => {
    const response = await apiClient(
        `/media/${mediaId}/restore`,
        {
            method: "POST",
        }
    );

    return handleResponse(
        response,
        "Failed to restore media"
    );
};


// =========================
// Permanently Delete
// =========================

export const permanentlyDeleteMedia =
    async (mediaId) => {

        const response = await apiClient(
            `/media/${mediaId}/permanent`,
            {
                method: "DELETE",
            }
        );

        return handleResponse(
            response,
            "Failed to permanently delete media"
        );
    };