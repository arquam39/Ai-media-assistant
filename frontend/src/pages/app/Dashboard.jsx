import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Image,
    Heart,
    MessageSquare,
    HardDrive,
    Upload,
    FileText,
    Video,
    Music,
    File,
    ArrowRight,
    Sparkles,
} from "lucide-react";

import {
    fetchMedia,
    uploadMedia,
} from "../../store/slices/mediaSlice";

import {
    fetchConversations,
} from "../../store/slices/conversationSlice";
import MediaUpload from "../../components/media/MediaUpload";


// =========================
// Helpers
// =========================

const formatStorage = (bytes) => {
    if (!bytes) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return `${(
        bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};


const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
};


const getMediaIcon = (type) => {
    switch (type) {
        case "image":
            return Image;

        case "video":
            return Video;

        case "audio":
            return Music;

        case "document":
            return FileText;

        default:
            return File;
    }
};


// =========================
// Stat Card
// =========================

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconStyle,
}) {
    return (
        <div
            className="
                group
                rounded-2xl
                border
                border-blue-100
                bg-white
                p-5
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md

                dark:border-white/10
                dark:bg-white/[0.03]
            "
        >
            <div className="flex items-start justify-between">
                <div>
                    <p
                        className="
                            text-sm
                            font-medium
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        {title}
                    </p>

                    <h3
                        className="
                            mt-2
                            text-2xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                        "
                    >
                        {value}
                    </h3>
                </div>

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        ${iconStyle}
                    `}
                >
                    <Icon size={19} />
                </div>
            </div>

            <p
                className="
                    mt-3
                    text-xs
                    text-slate-400
                    dark:text-slate-500
                "
            >
                {description}
            </p>
        </div>
    );
}


// =========================
// Dashboard
// =========================

function Dashboard() {
    const dispatch = useDispatch();
    const [showUpload, setShowUpload] = useState(false);
    const navigate = useNavigate();
    // =========================
    // Upload
    // =========================

    const handleUpload = async (files) => {
        try {
            await dispatch(
                uploadMedia(files)
            ).unwrap();

            setShowUpload(false);
        } catch (error) {
            console.error(
                "Upload failed:",
                error
            );
        }
    };

    const {
        items: media,
        loading: mediaLoading,
        error: mediaError,
        uploading
    } = useSelector(
        (state) => state.media
    );

    const {
        items: conversations,
        loading: conversationsLoading,
        error: conversationsError,
    } = useSelector(
        (state) => state.conversations
    );

    const user = useSelector((state) => state.auth.user);

    // =========================
    // Fetch Dashboard Data
    // =========================

    useEffect(() => {
        dispatch(fetchMedia());
        dispatch(fetchConversations());
    }, [dispatch]);


    // =========================
    // Statistics
    // =========================

    const totalMedia = media.length;

    const favoriteMedia = media.filter(
        (item) => item.isFavorite
    ).length;

    const totalConversations =
        conversations.length;

    const totalStorage = media.reduce(
        (total, item) =>
            total + (item.size || 0),
        0
    );


    // =========================
    // Recent Data
    // =========================

    const recentMedia = [...media]
        .sort(
            (a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
        )
        .slice(0, 3);

    const recentConversations =
        [...conversations]
            .sort(
                (a, b) =>
                    new Date(b.updatedAt) -
                    new Date(a.updatedAt)
            )
            .slice(0, 3);


    return (
        <div className="space-y-8">


            {/* =========================
                Header
            ========================= */}

            <section
                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles
                            size={18}
                            className="
                                text-blue-600
                                dark:text-blue-400
                            "
                        />

                        <span
                            className="
                                text-sm
                                font-medium
                                text-blue-600
                                dark:text-blue-400
                            "
                        >
                            AI Media Assistant
                        </span>
                    </div>

                    <h1
                        className="
                            mt-2
                            text-3xl
                            font-bold
                            tracking-tight
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Welcome back, {user?.name?.split(" ")[0] || "User"}
                    </h1>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Manage your media and continue
                        your AI conversations.
                    </p>
                </div>


                <button
                    type="button"
                    onClick={() =>
                        setShowUpload(true)
                    }
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        py-2.5
                        text-sm
                        font-medium
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        active:scale-[0.98]
                    "
                >
                    <Upload size={17} />

                    Upload Media
                </button>


            </section>

            {showUpload && (
                <MediaUpload
                    onUpload={handleUpload}
                    uploading={uploading}
                    onClose={() =>
                        setShowUpload(false)
                    }
                />
            )}


            {/* =========================
                Stats
            ========================= */}

            <section
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                "
            >
                <StatCard
                    title="Total Media"
                    value={
                        mediaLoading
                            ? "..."
                            : totalMedia
                    }
                    description="All uploaded media"
                    icon={Image}
                    iconStyle="
                        bg-blue-50
                        text-blue-600
                        dark:bg-blue-500/10
                        dark:text-blue-400
                    "
                />

                <StatCard
                    title="Favorites"
                    value={
                        mediaLoading
                            ? "..."
                            : favoriteMedia
                    }
                    description="Your favorite files"
                    icon={Heart}
                    iconStyle="
                        bg-rose-50
                        text-rose-600
                        dark:bg-rose-500/10
                        dark:text-rose-400
                    "
                />

                <StatCard
                    title="Conversations"
                    value={
                        conversationsLoading
                            ? "..."
                            : totalConversations
                    }
                    description="AI conversations"
                    icon={MessageSquare}
                    iconStyle="
                        bg-violet-50
                        text-violet-600
                        dark:bg-violet-500/10
                        dark:text-violet-400
                    "
                />

                <StatCard
                    title="Storage"
                    value={
                        mediaLoading
                            ? "..."
                            : formatStorage(
                                totalStorage
                            )
                    }
                    description="Total media size"
                    icon={HardDrive}
                    iconStyle="
                        bg-emerald-50
                        text-emerald-600
                        dark:bg-emerald-500/10
                        dark:text-emerald-400
                    "
                />
            </section>


            {/* =========================
                Main Content
            ========================= */}

            <section
                className="
                    grid
                    grid-cols-1
                    gap-6
                    xl:grid-cols-2
                "
            >


                {/* =========================
                    Recent Media
                ========================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-100
                        bg-white
                        shadow-sm

                        dark:border-white/10
                        dark:bg-white/[0.03]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-blue-100
                            px-5
                            py-4

                            dark:border-white/10
                        "
                    >
                        <div>
                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Recent Media
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Your latest uploads
                            </p>
                        </div>

                        <button
                            className="
                                flex
                                items-center
                                gap-1
                                text-sm
                                font-medium
                                cursor-pointer
                                text-blue-600
                                hover:text-blue-700
                                dark:text-blue-400
                            "
                            onClick={() => navigate("/media")}
                        >
                            View all

                            <ArrowRight size={15} />
                        </button>
                    </div>


                    <div className="divide-y divide-blue-50 dark:divide-white/5">

                        {mediaLoading && (
                            <div className="space-y-3 p-5">
                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="
                                                h-14
                                                animate-pulse
                                                rounded-xl
                                                bg-slate-100
                                                dark:bg-white/5
                                            "
                                        />
                                    )
                                )}
                            </div>
                        )}


                        {!mediaLoading &&
                            mediaError && (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-red-500">
                                        {mediaError}
                                    </p>
                                </div>
                            )}


                        {!mediaLoading &&
                            !mediaError &&
                            recentMedia.length === 0 && (
                                <div className="p-10 text-center">
                                    <Image
                                        size={32}
                                        className="
                                            mx-auto
                                            text-slate-300
                                            dark:text-slate-600
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        No media yet
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Upload your first file
                                        to get started.
                                    </p>
                                </div>
                            )}


                        {!mediaLoading &&
                            !mediaError &&
                            recentMedia.map(
                                (item) => {
                                    const Icon =
                                        getMediaIcon(
                                            item.type
                                        );

                                    return (
                                        <div
                                            key={item._id}
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                px-5
                                                py-3.5
                                                transition
                                                hover:bg-blue-50/50
                                                dark:hover:bg-white/[0.03]
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    h-10
                                                    w-10
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-blue-50
                                                    text-blue-600
                                                    dark:bg-blue-500/10
                                                    dark:text-blue-400
                                                "
                                            >
                                                <Icon
                                                    size={18}
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-medium
                                                        text-slate-800
                                                        dark:text-slate-200
                                                    "
                                                >
                                                    {
                                                        item.originalName
                                                    }
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-xs
                                                        text-slate-400
                                                    "
                                                >
                                                    {item.type}
                                                    {" • "}
                                                    {formatStorage(
                                                        item.size
                                                    )}
                                                </p>
                                            </div>

                                            {item.isFavorite && (
                                                <Heart
                                                    size={15}
                                                    className="
                                                        shrink-0
                                                        fill-current
                                                        text-rose-500
                                                    "
                                                />
                                            )}
                                        </div>
                                    );
                                }
                            )}
                    </div>
                </div>


                {/* =========================
                    Recent Conversations
                ========================= */}

                <div
                    className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-100
                        bg-white
                        shadow-sm

                        dark:border-white/10
                        dark:bg-white/[0.03]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-blue-100
                            px-5
                            py-4

                            dark:border-white/10
                        "
                    >
                        <div>
                            <h2
                                className="
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                "
                            >
                                Recent Conversations
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-400
                                "
                            >
                                Continue where you left off
                            </p>
                        </div>

                        <button
                            className="
                                flex
                                items-center
                                gap-1
                                text-sm
                                font-medium
                                cursor-pointer
                                text-blue-600
                                hover:text-blue-700
                                dark:text-blue-400
                            "
                            onClick={() => navigate("/chat")}
                        >
                            View all

                            <ArrowRight size={15} />
                        </button>
                    </div>


                    <div className="divide-y divide-blue-50 dark:divide-white/5">

                        {conversationsLoading && (
                            <div className="space-y-3 p-5">
                                {[1, 2, 3, 4].map(
                                    (item) => (
                                        <div
                                            key={item}
                                            className="
                                                h-14
                                                animate-pulse
                                                rounded-xl
                                                bg-slate-100
                                                dark:bg-white/5
                                            "
                                        />
                                    )
                                )}
                            </div>
                        )}


                        {!conversationsLoading &&
                            conversationsError && (
                                <div className="p-8 text-center">
                                    <p className="text-sm text-red-500">
                                        {conversationsError}
                                    </p>
                                </div>
                            )}


                        {!conversationsLoading &&
                            !conversationsError &&
                            recentConversations.length === 0 && (
                                <div className="p-10 text-center">
                                    <MessageSquare
                                        size={32}
                                        className="
                                            mx-auto
                                            text-slate-300
                                            dark:text-slate-600
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            font-medium
                                            text-slate-700
                                            dark:text-slate-300
                                        "
                                    >
                                        No conversations yet
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-slate-400
                                        "
                                    >
                                        Start a conversation
                                        with your AI assistant.
                                    </p>
                                </div>
                            )}


                        {!conversationsLoading &&
                            !conversationsError &&
                            recentConversations.map(
                                (conversation) => (
                                    <div
                                        key={
                                            conversation._id
                                        }
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            px-5
                                            py-3.5
                                            transition
                                            hover:bg-blue-50/50
                                            dark:hover:bg-white/[0.03]
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-violet-50
                                                text-violet-600
                                                dark:bg-violet-500/10
                                                dark:text-violet-400
                                            "
                                        >
                                            <MessageSquare
                                                size={18}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="
                                                    truncate
                                                    text-sm
                                                    font-medium
                                                    text-slate-800
                                                    dark:text-slate-200
                                                "
                                            >
                                                {
                                                    conversation.title
                                                }
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-xs
                                                    text-slate-400
                                                "
                                            >
                                                {
                                                    conversation
                                                        .lastMessage
                                                        ?.text ||
                                                    "No messages yet"
                                                }
                                            </p>
                                        </div>

                                        <span
                                            className="
                                                shrink-0
                                                text-[11px]
                                                text-slate-400
                                            "
                                        >
                                            {formatDate(
                                                conversation.updatedAt
                                            )}
                                        </span>
                                    </div>
                                )
                            )}
                    </div>
                </div>

            </section>


            {/* =========================
                Bottom CTA
            ========================= */}

            <section
                className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-blue-100
                    bg-gradient-to-r
                    from-blue-50
                    to-white
                    p-6

                    dark:border-blue-500/20
                    dark:from-blue-500/10
                    dark:to-white/[0.02]
                "
            >
                <div className="relative z-10">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-600
                            text-white
                        "
                    >
                        <Sparkles size={19} />
                    </div>

                    <h2
                        className="
                            mt-4
                            text-lg
                            font-semibold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Analyze something new
                    </h2>

                    <p
                        className="
                            mt-1
                            max-w-xl
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                        "
                    >
                        Upload an image, video, audio file,
                        or document and let your AI assistant
                        help you understand it.
                    </p>

                </div>
            </section>

        </div>
    );
}

export default Dashboard;
