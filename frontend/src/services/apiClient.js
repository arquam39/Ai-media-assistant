
const API_BASE_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshPromise = null;


// =========================
// Refresh Access Token
// =========================

const refreshAccessToken = async () => {
    const response = await fetch(
        `${API_BASE_URL}/auth/refresh`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Session expired");
    }

    return response;
};


// =========================
// API Client
// =========================

export const apiClient = async (
    endpoint,
    options = {}
) => {

    const isFormData =
        options.body instanceof FormData;

    const requestOptions = {
        ...options,

        credentials: "include",

        headers: {
            ...(isFormData
                ? {}
                : {
                    "Content-Type": "application/json",
                }),

            ...(options.headers || {}),
        },
    };


    // =========================
    // First Request
    // =========================

    let response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        requestOptions
    );


    // =========================
    // Request Successful
    // =========================

    if (response.status !== 401) {
        return response;
    }


    // =========================
    // Start Refresh
    // =========================

    if (!isRefreshing) {

        isRefreshing = true;

        refreshPromise =
            refreshAccessToken()
                .finally(() => {
                    isRefreshing = false;
                    refreshPromise = null;
                });
    }


    // =========================
    // Wait For Refresh
    // =========================

    try {
        await refreshPromise;
    } catch (error) {
        throw new Error(
            "Session expired"
        );
    }


    // =========================
    // Retry Original Request
    // =========================

    response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        requestOptions
    );

    return response;
};