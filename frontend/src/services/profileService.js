
import { apiClient } from "./apiClient.js";


// =========================
// Update Profile
// =========================

export const updateProfile = async (data) => {

    const response = await apiClient(
        "/users/profile",
        {
            method: "PATCH",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                name: data.name,
                bio: data.bio,
            }),
        }
    );


    const result = await response.json();


    if (!response.ok) {
        throw new Error(
            result.message ||
            "Unable to update profile"
        );
    }


    return result;
};