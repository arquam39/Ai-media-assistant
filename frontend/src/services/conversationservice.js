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
// Get Conversations
// =========================

export const getConversations = async () => {
    const response = await apiClient(
        "/conversations"
    );

    return handleResponse(
        response,
        "Failed to fetch conversations"
    );
};


// =========================
// Create Conversation
// =========================

export const createConversation = async (
    conversation
) => {
    const response = await apiClient(
        "/conversations",
        {
            method: "POST",

            body: JSON.stringify(
                conversation
            ),
        }
    );

    return handleResponse(
        response,
        "Failed to create conversation"
    );
};


// =========================
// Get Conversation
// =========================

export const getConversation = async (id) => {
    const response = await apiClient(
        `/conversations/${id}`
    );

    return handleResponse(
        response,
        "Failed to fetch conversation"
    );
};


// =========================
// Delete Conversation
// =========================

export const deleteConversation = async (id) => {
    const response = await apiClient(
        `/conversations/${id}`,
        {
            method: "DELETE",
        }
    );

    return handleResponse(
        response,
        "Failed to delete conversation"
    );
};