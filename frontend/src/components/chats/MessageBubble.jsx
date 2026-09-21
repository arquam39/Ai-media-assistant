import ReactMarkdown from "react-markdown";


function MessageBubble({ message }) {
    const isUser =
        message.role === "user";

    return (
        <div
            className={`
                flex
                w-full

                ${
                    isUser
                        ? "justify-end"
                        : "justify-start"
                }
            `}
        >
            <div
                className={`
                    max-w-[85%]
                    wrap-break-word
                    rounded-2xl
                    px-4
                    py-3
                    text-sm
                    leading-6
                    shadow-sm

                    sm:max-w-[75%]

                    ${
                        isUser
                            ? `
                                rounded-br-md
                                bg-blue-600
                                text-white
                                shadow-blue-500/10
                            `
                            : `
                                rounded-bl-md
                                border
                                border-blue-100
                                bg-white
                                text-slate-800

                                dark:border-white/10
                                dark:bg-white/4
                                dark:text-slate-200
                            `
                    }
                `}
            >
               <ReactMarkdown>
                {message.content}
            </ReactMarkdown>
            </div>
        </div>
    );
}

export default MessageBubble;