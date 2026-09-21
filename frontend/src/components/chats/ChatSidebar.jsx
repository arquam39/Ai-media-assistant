import {
    MessageSquare,
    Plus,
    Trash2,
    X,
} from "lucide-react";

function ChatSidebar({
    conversations,
    activeId,
    onSelect,
    onCreate,
    onDelete,
    isOpen,
    onClose,
}) {
    return (
        <>
            {/* Mobile backdrop */}

            {isOpen && (
                <div
                    onClick={onClose}
                    className="
                        fixed
                        inset-0
                        z-30
                        bg-black/40
                        backdrop-blur-sm

                        lg:hidden
                    "
                />
            )}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-40
                    flex
                    w-72
                    max-w-[80vw]
                    flex-col
                    border-r
                    border-blue-100
                    bg-white
                    transition-transform
                    duration-300
                    ease-in-out

                    dark:border-white/10
                    dark:bg-[#0c0c0f]

                    lg:static
                    lg:z-0
                    lg:w-72
                    lg:translate-x-0

                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-blue-50
                        px-4
                        py-4

                        dark:border-white/10
                    "
                >
                    <div>
                        <h2
                            className="
                                text-sm
                                font-semibold
                                text-slate-900

                                dark:text-white
                            "
                        >
                            Conversations
                        </h2>

                        <p
                            className="
                                mt-0.5
                                text-xs
                                text-slate-400

                                dark:text-slate-500
                            "
                        >
                            Your chat history
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onCreate}
                            aria-label="New conversation"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-600
                                text-white
                                shadow-sm
                                transition-all
                                duration-200

                                hover:-translate-y-0.5
                                hover:bg-blue-700
                                hover:shadow-md
                            "
                        >
                            <Plus
                                size={17}
                                strokeWidth={2.2}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close sidebar"
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-xl
                                text-slate-500

                                hover:bg-slate-100

                                dark:text-slate-400
                                dark:hover:bg-white/10

                                lg:hidden
                            "
                        >
                            <X
                                size={17}
                                strokeWidth={2.2}
                            />
                        </button>
                    </div>
                </div>

                {/* Conversations */}

                <div
                    className="
                        custom-scrollbar
                        min-h-0
                        flex-1
                        overflow-y-auto
                        overflow-x-hidden
                        px-2
                        py-2
                    "
                >
                    {conversations.length === 0 ? (
                        <div
                            className="
                                flex
                                h-full
                                min-h-32
                                flex-col
                                items-center
                                justify-center
                                px-4
                                text-center
                            "
                        >
                            <div
                                className="
                                    mb-3
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-400

                                    dark:bg-blue-500/10
                                    dark:text-blue-400
                                "
                            >
                                <MessageSquare size={18} />
                            </div>

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-600

                                    dark:text-slate-300
                                "
                            >
                                No conversations
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-400

                                    dark:text-slate-500
                                "
                            >
                                Start a new chat to begin
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {conversations.map(
                                (conversation) => {

                                    const isActive =
                                        activeId ===
                                        conversation._id;

                                    // Media conversations use
                                    // the current media name.
                                    // Normal conversations use
                                    // their own title.
                                    const displayName =
                                        conversation.mediaId?.originalName ||
                                        conversation.title;

                                    return (
                                        <div
                                            key={
                                                conversation._id
                                            }
                                            className={`
                                                group
                                                flex
                                                items-center
                                                gap-1
                                                rounded-xl
                                                border
                                                px-2
                                                py-1
                                                transition-all
                                                duration-200

                                                ${
                                                    isActive
                                                        ? "border-blue-100 bg-blue-50 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10"
                                                        : "border-transparent hover:border-blue-100 hover:bg-blue-50/50 dark:hover:border-white/10 dark:hover:bg-white/3"
                                                }
                                            `}
                                        >
                                            {/* Conversation */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onSelect(
                                                        conversation
                                                    )
                                                }
                                                className="
                                                    flex
                                                    min-w-0
                                                    flex-1
                                                    items-center
                                                    gap-3
                                                    rounded-lg
                                                    px-2
                                                    py-2.5
                                                    text-left
                                                    outline-none
                                                "
                                            >
                                                <MessageSquare
                                                    size={16}
                                                    strokeWidth={1.8}
                                                    className={`
                                                        shrink-0

                                                        ${
                                                            isActive
                                                                ? "text-blue-600 dark:text-blue-400"
                                                                : "text-slate-400 dark:text-slate-500"
                                                        }
                                                    `}
                                                />

                                                <span
                                                    className={`
                                                        min-w-0
                                                        flex-1
                                                        truncate
                                                        text-sm

                                                        ${
                                                            isActive
                                                                ? "font-medium text-slate-900 dark:text-white"
                                                                : "text-slate-600 dark:text-slate-400"
                                                        }
                                                    `}
                                                >
                                                    {displayName}
                                                </span>
                                            </button>

                                            {/* Delete */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        conversation._id
                                                    )
                                                }
                                                aria-label="Delete conversation"
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    text-slate-400
                                                    opacity-0
                                                    transition-all
                                                    duration-200

                                                    hover:bg-red-50
                                                    hover:text-red-500

                                                    group-hover:opacity-100
                                                    focus:opacity-100

                                                    dark:text-slate-500
                                                    dark:hover:bg-red-500/10
                                                    dark:hover:text-red-400
                                                "
                                            >
                                                <Trash2
                                                    size={15}
                                                    strokeWidth={1.8}
                                                />
                                            </button>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

export default ChatSidebar;