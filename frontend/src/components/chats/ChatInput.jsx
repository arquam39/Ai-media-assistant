import { useState } from "react";

import {
    ArrowUp,
    LoaderCircle,
} from "lucide-react";

function ChatInput({
    onSend,
    disabled = false,
}) {
    const [content, setContent] =
        useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmed =
            content.trim();

        if (!trimmed || disabled) {
            return;
        }

        await onSend(trimmed);

        setContent("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="
                flex
                items-end
                gap-2
                rounded-2xl
                border
                border-blue-200
                bg-white
                p-2
                shadow-sm
                transition

                focus-within:border-blue-300
                focus-within:ring-4
                focus-within:ring-blue-500/10

                dark:border-white/10
                dark:bg-white/3
                dark:focus-within:border-blue-500/40
                dark:focus-within:ring-blue-500/10
            "
        >
            <textarea
                value={content}
                onChange={(e) =>
                    setContent(e.target.value)
                }
                onKeyDown={(e) => {
                    if (
                        e.key === "Enter" &&
                        !e.shiftKey
                    ) {
                        e.preventDefault();

                        handleSubmit(e);
                    }
                }}
                rows={1}
                disabled={disabled}
                placeholder="Ask anything..."
                className="
                    min-h-11
                    max-h-32
                    flex-1
                    resize-none
                    bg-transparent
                    px-3
                    py-3
                    text-sm
                    leading-5
                    text-slate-900
                    outline-none
                    
                    placeholder:text-slate-400

                    disabled:cursor-not-allowed
                    disabled:opacity-60

                    dark:text-white
                    dark:placeholder:text-slate-500
                "
            />

            <button
                type="submit"
                disabled={
                    disabled ||
                    !content.trim()
                }
                aria-label="Send message"
                className="
                    flex
                    h-11
                    w-11
                    shrink-0
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

                    active:translate-y-0

                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    disabled:hover:translate-y-0
                    disabled:hover:shadow-sm
                "
            >
                {disabled ? (
                    <LoaderCircle
                        size={18}
                        className="animate-spin"
                    />
                ) : (
                    <ArrowUp
                        size={18}
                        strokeWidth={2.2}
                    />
                )}
            </button>
        </form>
    );
}

export default ChatInput;