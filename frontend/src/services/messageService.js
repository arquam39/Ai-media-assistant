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
// Get Messages
// =========================

export const getMessages =
    async (conversationId) => {

        const response =
            await apiClient(
                `/messages/${conversationId}`
            );

        return handleResponse(
            response,
            "Failed to fetch messages"
        );
    };


// =========================
// Send Message
// =========================

export const sendMessage =
    async (
        conversationId,
        content
    ) => {

        const response =
            await apiClient(
                "/messages",
                {
                    method: "POST",

                    body: JSON.stringify({
                        conversationId,
                        content,
                    }),
                }
            );

        return handleResponse(
            response,
            "Failed to send message"
        );
    };