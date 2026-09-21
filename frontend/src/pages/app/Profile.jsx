import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Save,
    LoaderCircle,
} from "lucide-react";

import { useSelector } from "react-redux";

import { updateProfile } from "../../services/profileService.js";


function Profile() {

    const user = useSelector(
        (state) => state.auth.user
    );


    const [name, setName] = useState("");
    const [bio, setBio] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =========================
    // Load User Data
    // =========================

    useEffect(() => {

        if (user) {

            setName(user.name || "");

            setBio(
                user.profile?.bio || ""
            );
        }

    }, [user]);


    // =========================
    // Update Profile
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");
            setSuccess("");


            const response = await updateProfile({
                name,
                bio,
            });


            console.log(
                "Updated profile:",
                response
            );


            setSuccess(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to update profile"
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="mx-auto max-w-3xl space-y-6">

            {/* =========================
                Header
            ========================= */}

            <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Profile
                </h1>

                <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                    Manage your personal information.
                </p>

            </div>


            {/* =========================
                Form
            ========================= */}

            <form
                onSubmit={handleSubmit}
                className="
                    rounded-2xl
                    border border-blue-100
                    bg-white
                    p-6
                    shadow-sm
                    dark:border-white/10
                    dark:bg-white/[0.03]
                "
            >

                {/* =========================
                    Form Header
                ========================= */}

                <div className="mb-6 flex items-center gap-4">

                    <div
                        className="
                            flex h-16 w-16
                            items-center justify-center
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                            dark:bg-blue-500/10
                            dark:text-blue-400
                        "
                    >
                        <User size={28} />
                    </div>


                    <div>

                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Personal Information
                        </h2>

                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                            Update your profile details.
                        </p>

                    </div>

                </div>


                {/* =========================
                    Error
                ========================= */}

                {error && (
                    <div
                        className="
                            mb-5
                            rounded-xl
                            border border-red-200
                            bg-red-50
                            px-4 py-3
                            text-sm text-red-600
                            dark:border-red-500/20
                            dark:bg-red-500/10
                            dark:text-red-400
                        "
                    >
                        {error}
                    </div>
                )}


                {/* =========================
                    Success
                ========================= */}

                {success && (
                    <div
                        className="
                            mb-5
                            rounded-xl
                            border border-green-200
                            bg-green-50
                            px-4 py-3
                            text-sm text-green-600
                            dark:border-green-500/20
                            dark:bg-green-500/10
                            dark:text-green-400
                        "
                    >
                        {success}
                    </div>
                )}


                <div className="space-y-5">

                    {/* =========================
                        Name
                    ========================= */}

                    <div>

                        <label
                            htmlFor="profile-name"
                            className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-700
                                dark:text-zinc-300
                            "
                        >
                            Name
                        </label>


                        <div className="relative">

                            <User
                                size={17}
                                className="
                                    absolute left-3 top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                    dark:text-zinc-500
                                "
                            />


                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-11 w-full
                                    rounded-xl
                                    border border-blue-100
                                    bg-white
                                    pl-10 pr-3
                                    text-sm
                                    text-slate-900
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-blue-300
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                    dark:border-white/10
                                    dark:bg-white/[0.03]
                                    dark:text-white
                                    dark:focus:border-blue-500/50
                                    dark:focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>


                    {/* =========================
                        Email
                    ========================= */}

                    <div>

                        <label
                            htmlFor="profile-email"
                            className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-700
                                dark:text-zinc-300
                            "
                        >
                            Email
                        </label>


                        <div className="relative">

                            <Mail
                                size={17}
                                className="
                                    absolute left-3 top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                    dark:text-zinc-500
                                "
                            />


                            <input
                                id="profile-email"
                                type="email"
                                value={
                                    user?.email || ""
                                }
                                disabled
                                className="
                                    h-11 w-full
                                    cursor-not-allowed
                                    rounded-xl
                                    border border-slate-200
                                    bg-slate-50
                                    pl-10 pr-3
                                    text-sm
                                    text-slate-500
                                    outline-none
                                    dark:border-white/10
                                    dark:bg-white/[0.02]
                                    dark:text-zinc-500
                                "
                            />

                        </div>


                        <p className="mt-1.5 text-xs text-slate-400 dark:text-zinc-500">
                            Email address cannot be changed here.
                        </p>

                    </div>


                    {/* =========================
                        Bio
                    ========================= */}

                    <div>

                        <label
                            htmlFor="profile-bio"
                            className="
                                mb-2 block
                                text-sm font-medium
                                text-slate-700
                                dark:text-zinc-300
                            "
                        >
                            Bio
                        </label>


                        <textarea
                            id="profile-bio"
                            rows={5}
                            value={bio}
                            onChange={(e) =>
                                setBio(
                                    e.target.value
                                )
                            }
                            placeholder="Tell us a little about yourself..."
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border border-blue-100
                                bg-white
                                p-3
                                text-sm
                                text-slate-900
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-300
                                focus:ring-4
                                focus:ring-blue-500/10
                                dark:border-white/10
                                dark:bg-white/[0.03]
                                dark:text-white
                                dark:placeholder:text-zinc-500
                                dark:focus:border-blue-500/50
                            "
                        />

                    </div>

                </div>


                {/* =========================
                    Save Button
                ========================= */}

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        mt-6
                        inline-flex
                        items-center gap-2
                        rounded-xl
                        bg-blue-600
                        px-5 py-3
                        text-sm font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        active:scale-[0.98]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        dark:bg-blue-500
                        dark:hover:bg-blue-600
                    "
                >

                    {loading ? (
                        <>
                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />

                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={17} />

                            Save Changes
                        </>
                    )}

                </button>

            </form>

        </div>
    );
}


export default Profile;