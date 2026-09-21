import { ImageOff, SearchX } from "lucide-react";
import MediaCard from "./MediaCard";

function MediaGrid({ media, viewMode = "grid" }) {
    if (!media.length) {
        return (
            <div
                className="
                    flex min-h-90
                    flex-col items-center justify-center
                    rounded-2xl
                    border border-blue-100
                    bg-white
                    px-6
                    text-center
                    dark:border-white/10
                    dark:bg-white/3
                "
            >
                <div
                    className="
                        flex h-16 w-16
                        items-center justify-center
                        rounded-2xl
                        bg-blue-50
                        text-blue-500
                        dark:bg-blue-500/10
                        dark:text-blue-400
                    "
                >
                    {viewMode === "grid" ? (
                        <ImageOff size={28} />
                    ) : (
                        <SearchX size={28} />
                    )}
                </div>

                <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-white">
                    No media found
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-zinc-400">
                    Try changing your search or filter to find your media.
                </p>
            </div>
        );
    }

    if (viewMode === "list") {
        return (
            <div className="space-y-3">
                {media.map((item) => (
                    <MediaCard
                        key={item._id}
                        media={item}
                        viewMode="list"
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className="
                grid grid-cols-1
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
            "
        >
            {media.map((item) => (
                <MediaCard
                    key={item._id}
                    media={item}
                    viewMode="grid"
                />
            ))}
        </div>
    );
}

export default MediaGrid;