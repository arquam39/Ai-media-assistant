import { apiClient } from "./apiClient";

const handleResponse = async (
    response,
    defaultMessage
) => {
    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            defaultMessage
        );
    }

    return data;
};



// =========================
// Submit Application
// =========================

export const submitApplication =
    async (formData) => {

        const response =
            await apiClient(
                "/applications",
                {
                    method: "POST",
                    body: formData
                }
            );

        return handleResponse(
            response,
            "Failed to submit application"
        );
    };

// =========================
// Get Applications
// =========================

export const getApplications =
    async () => {

        const response =
            await apiClient(
                "/applications"
            );

        return handleResponse(
            response,
            "Failed to fetch applications"
        );
    };


// =========================
// Get Single Application
// =========================

export const getApplicationById =
    async (applicationId) => {

        const response =
            await apiClient(
                `/applications/${applicationId}`
            );

        return handleResponse(
            response,
            "Failed to fetch application"
        );
    };


// =========================
// Review Application
// =========================

export const reviewApplication =
    async ({
        applicationId,
        reviewData
    }) => {

        const response =
            await apiClient(
                `/applications/${applicationId}/review`,
                {
                    method: "PATCH",

                    body:
                        JSON.stringify(
                            reviewData
                        ),
                }
            );

        return handleResponse(
            response,
            "Failed to review application"
        );
    };

export const deleteApplication =
    async (applicationId) => {

        const response =
            await apiClient(
                `/applications/${applicationId}`,
                {
                    method: "DELETE"
                }
            );

        return handleResponse(
            response,
            "Failed to delete application"
        );
    };


export const reopenApplication =
    async (applicationId) => {

        const response =
            await apiClient(
                `/applications/${applicationId}/reopen`,
                {
                    method: "PATCH"
                }
            );

        return handleResponse(
            response,
            "Failed to reopen application"
        );
    };