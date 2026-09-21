import multer from "multer";


// =========================
// Allowed File Types
// =========================

const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",

    "application/pdf"
];


// =========================
// File Filter
// =========================

const fileFilter = (
    req,
    file,
    cb
) => {

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, PNG, WEBP and PDF files are supported"
            ),
            false
        );
    }
};


// =========================
// Multer
// =========================

const applicationUpload = multer({

    storage:
        multer.memoryStorage(),

    limits: {

        // Maximum size of each file
        fileSize:
            10 * 1024 * 1024,

        // Maximum number of files
        files: 4
    },

    fileFilter
});


export default applicationUpload;