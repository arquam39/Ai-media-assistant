import cloudinary from "../config/cloudinary.js";
import { randomUUID } from "crypto";


// =========================
// Upload Media To Cloudinary
// =========================

export const uploadMediaToCloudinary = ({
    buffer,
    originalName,
    mimeType,
    userId = null,
    applicationId = null
}) => {

    return new Promise((resolve, reject) => {

        const extension =
            originalName.includes(".")
                ? originalName.substring(
                    originalName.lastIndexOf(".")
                )
                : "";


        // =========================
        // Create Public ID
        // =========================

        let publicId;


        if (applicationId) {

            publicId =
                `applications/${applicationId}/documents/${randomUUID()}${extension}`;

        } else if (userId) {

            publicId =
                `users/${userId}/media/${randomUUID()}${extension}`;

        } else {

            reject(
                new Error(
                    "Either userId or applicationId is required"
                )
            );

            return;
        }


        // =========================
        // Resource Type
        // =========================

        const resourceType =
            mimeType.startsWith("image/")
                ? "image"
                : "raw";


        // =========================
        // Upload
        // =========================

        const uploadStream =
            cloudinary.uploader.upload_stream(

                {
                    resource_type:
                        resourceType,

                    public_id:
                        publicId
                },

                (error, result) => {

                    if (error) {

                        reject(error);

                        return;
                    }


                    console.log(
                        "CLOUDINARY UPLOAD RESULT:",
                        {
                            publicId:
                                result.public_id,

                            resourceType:
                                result.resource_type,

                            type:
                                result.type,

                            url:
                                result.secure_url
                        }
                    );


                    resolve(result);
                }
            );


        uploadStream.end(buffer);
    });
};


// =========================
// Delete Media From Cloudinary
// =========================

export const deleteMediaFromCloudinary = ({
    publicId,
    resourceType
}) => {

    return new Promise(
        (resolve, reject) => {

            cloudinary.uploader.destroy(
                publicId,
                {
                    resource_type:
                        resourceType
                },
                (error, result) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result);
                }
            );
        }
    );
};