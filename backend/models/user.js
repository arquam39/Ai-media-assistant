import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false
        },
        
        isVerified: {
            type: Boolean,
            default: false
        },

        profile: {
            avatar: {
                type: String,
                default: ""
            },

            bio: {
                type: String,
                default: "",
                maxlength: 500
            }
        },

        settings: {
            theme: {
                type: String,
                enum: ["light", "dark", "system"],
                default: "system"
            },

            notifications: {
                type: Boolean,
                default: true
            }
        },

        // Password Reset
        resetOtpHash: {
            type: String,
            default: null,
            select: false
        },

        resetOtpExpiry: {
            type: Date,
            default: null,
            select: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;