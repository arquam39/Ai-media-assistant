import { useEffect, useRef, useState } from "react";

import {
    Bot,
    Menu,
    Sparkles,
} from "lucide-react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    fetchConversations,
    fetchConversation,
    createConversation,
    deleteConversation,
    setActiveConversation,
    clearActiveConversation,
} from "../../store/slices/conversationSlice";

import {
    fetchMessages,
    sendMessage,
    clearMessages,
    addMessage,
    removeMessage,
} from "../../store/slices/messageSlice";

import ChatSidebar from "./ChatSidebar";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import MessageSources from "./MessageSources";


function Chat() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();


    // =========================
    // URL Parameters
    // =========================

    const mediaId =
        searchParams.get("mediaId");

    const conversationId =
        searchParams.get("conversationId");


    // =========================
    // Refs
    // =========================

    const messagesEndRef =
        useRef(null);

    /*
     * When we create a conversation locally
     * (inside handleSend) we already have
     * everything we need in the store — we
     * set it there directly. These refs tell
     * the URL-driven effects below to skip
     * their next run so they don't stomp on
     * the optimistic message / freshly-set
     * active conversation with a premature
     * (and likely empty) re-fetch.
     */

    const skipNextConversationFetch =
        useRef(false);

    const skipNextMessagesFetch =
        useRef(false);


    // =========================
    // Sidebar (mobile drawer) State
    // =========================

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    // =========================
    // Conversation State
    // =========================

    const {
        items: conversations,
        activeConversation,
        loading: conversationsLoading,
        error: conversationsError,
    } = useSelector(
        (state) =>
            state.conversations
    );


    // =========================
    // Message State
    // =========================

    const {
        items: messages,
        loading: messagesLoading,
        sending,
        error: messagesError,
    } = useSelector(
        (state) =>
            state.messages
    );


    // =========================
    // Fetch Conversations
    // =========================

    useEffect(() => {

        dispatch(
            fetchConversations()
        );

    }, [dispatch]);


    // =========================
    // Fetch Specific Conversation
    // =========================

    useEffect(() => {

        if (!conversationId) {
            return;
        }

        /*
         * Skip once if we just created this
         * conversation ourselves in handleSend —
         * we already set it as active locally,
         * so re-fetching here would race with
         * the still-in-flight sendMessage call
         * and wipe out the optimistic message.
         */

        if (skipNextConversationFetch.current) {

            skipNextConversationFetch.current =
                false;

            return;

        }

        dispatch(
            clearMessages()
        );

        dispatch(
            fetchConversation(
                conversationId
            )
        );

    }, [
        conversationId,
        dispatch,
    ]);


    // =========================
    // Handle Media Conversation
    // =========================

    useEffect(() => {

        /*
         * If we already have a conversationId,
         * don't run the media lookup.
         */

        if (
            !mediaId ||
            conversationId ||
            conversationsLoading
        ) {
            return;
        }


        const existingConversation =
            conversations.find(
                (conversation) => {

                    const conversationMediaId =
                        conversation.mediaId?._id ||
                        conversation.mediaId;

                    return (
                        String(
                            conversationMediaId
                        ) ===
                        String(mediaId)
                    );
                }
            );


        // =========================
        // Existing Conversation
        // =========================

        if (existingConversation) {

            dispatch(
                clearMessages()
            );

            dispatch(
                setActiveConversation(
                    existingConversation
                )
            );

            return;
        }


        // =========================
        // No Existing Conversation
        // =========================

        dispatch(
            clearMessages()
        );

        dispatch(
            clearActiveConversation()
        );

    }, [
        mediaId,
        conversationId,
        conversations,
        conversationsLoading,
        dispatch,
    ]);


    // =========================
    // Fetch Messages
    // =========================

    useEffect(() => {

        if (
            !activeConversation?._id
        ) {
            return;
        }

        /*
         * Same reasoning as above: skip the
         * fetch once right after we locally
         * create + activate a brand-new
         * conversation, so we don't overwrite
         * the optimistic first message before
         * sendMessage has finished saving it.
         */

        if (skipNextMessagesFetch.current) {

            skipNextMessagesFetch.current =
                false;

            return;

        }

        dispatch(
            fetchMessages(
                activeConversation._id
            )
        );

    }, [
        dispatch,
        activeConversation?._id,
    ]);


    // =========================
    // Auto Scroll
    // =========================

    useEffect(() => {

        if (
            !messagesEndRef.current
        ) {
            return;
        }


        messagesEndRef.current.scrollIntoView({
            behavior: "smooth",
        });

    }, [
        messages,
        sending,
    ]);


    // =========================
    // New Chat
    // =========================

    const handleCreate = () => {

        dispatch(
            clearMessages()
        );

        dispatch(
            clearActiveConversation()
        );

        setSidebarOpen(false);

        navigate("/chat");

    };


    // =========================
    // Select Conversation
    // =========================

    const handleSelect = (
        conversation
    ) => {

        dispatch(
            clearMessages()
        );


        /*
         * We don't need to manually set
         * the conversation here.
         *
         * We navigate using conversationId
         * and let fetchConversation() load it.
         */

        setSidebarOpen(false);

        navigate(
            `/chat?conversationId=${conversation._id}`
        );

    };


    // =========================
    // Delete Conversation
    // =========================

    const handleDelete = async (
        id
    ) => {

        try {

            await dispatch(
                deleteConversation(id)
            ).unwrap();


            dispatch(
                clearMessages()
            );


            /*
             * If the deleted conversation
             * was currently open, go to
             * normal chat page.
             */

            if (
                activeConversation?._id ===
                id
            ) {

                navigate("/chat");

            }

        } catch (error) {

            console.error(
                "Delete conversation failed:",
                error
            );

        }

    };


    // =========================
    // Send Message
    // =========================

    const handleSend = async (
        content
    ) => {

        let conversationId =
            activeConversation?._id;


        // =========================
        // Create Conversation
        // =========================

        if (!conversationId) {

            const conversationData = {
                title:
                    content.slice(0, 40),
            };


            /*
             * If this chat was opened
             * using a mediaId, attach
             * that media to conversation.
             */

            if (mediaId) {

                conversationData.mediaId =
                    mediaId;

            }


            /*
             * IMPORTANT: arm this guard BEFORE
             * dispatching createConversation, not
             * after.
             *
             * conversationSlice's
             * createConversation.fulfilled reducer
             * sets state.activeConversation itself,
             * synchronously, the moment the thunk
             * resolves — i.e. *during* the await
             * below, before our own code even gets
             * a chance to run. If we set this flag
             * after the await, the "Fetch Messages"
             * effect can already have fired (with
             * the guard still false) and kicked off
             * a fetchMessages call for a conversation
             * that has zero messages saved yet.
             *
             * That fetch doesn't get cancelled — it
             * resolves later (even after sendMessage
             * finishes) and unconditionally
             * overwrites items with the stale empty
             * result, wiping the message out until a
             * manual refresh re-fetches for real.
             *
             * Arming the guard here, before the
             * dispatch, guarantees it's already true
             * by the time that effect could possibly
             * run, no matter how the state update
             * gets batched.
             */

            skipNextMessagesFetch.current =
                true;


            let result;

            try {

                result =
                    await dispatch(
                        createConversation(
                            conversationData
                        )
                    ).unwrap();

            } catch (error) {

                // Creation failed — release the
                // guard so a later, real
                // conversation switch isn't
                // silently skipped.

                skipNextMessagesFetch.current =
                    false;

                console.error(
                    "Create conversation failed:",
                    error
                );

                return;

            }


            conversationId =
                result._id;


            /*
             * activeConversation is already set
             * by createConversation.fulfilled —
             * no need to dispatch
             * setActiveConversation ourselves.
             *
             * Arm this second guard right before
             * navigate(), which is what actually
             * changes the conversationId URL
             * param and would otherwise trigger
             * the "Fetch Specific Conversation"
             * effect (clearMessages +
             * fetchConversation) redundantly.
             */

            skipNextConversationFetch.current =
                true;

            navigate(
                `/chat?conversationId=${conversationId}`,
                {
                    replace: true,
                }
            );

        }


        // =========================
        // Optimistic Message
        // =========================

        const temporaryId =
            `temp-${Date.now()}`;


        const optimisticMessage = {

            _id: temporaryId,

            conversationId,

            role: "user",

            content,

            createdAt:
                new Date().toISOString(),

        };


        dispatch(
            addMessage(
                optimisticMessage
            )
        );


        // =========================
        // Send Message
        // =========================

        try {

            await dispatch(
                sendMessage({
                    conversationId,
                    content,
                })
            ).unwrap();

        } catch (error) {

            dispatch(
                removeMessage(
                    temporaryId
                )
            );

        }

    };


    // =========================
    // Conversation Display Name
    // =========================

    const conversationTitle =
        activeConversation?.mediaId
            ?.originalName ||
        activeConversation?.title ||
        "AI Assistant";


    // =========================
    // Render
    // =========================

    return (

        <div
            className="
                h-[calc(100vh-8rem)]
                overflow-hidden
                rounded-2xl
                border
                border-blue-100
                bg-white
                shadow-sm

                dark:border-white/10
                dark:bg-[#0c0c0f]
            "
        >

            <div
                className="
                    flex
                    h-full
                    flex-col
                    lg:flex-row
                "
            >

                {/* =========================
                    Sidebar
                ========================= */}

                <ChatSidebar
                    conversations={
                        conversations
                    }

                    activeId={
                        activeConversation?._id
                    }

                    onSelect={
                        handleSelect
                    }

                    onCreate={
                        handleCreate
                    }

                    onDelete={
                        handleDelete
                    }

                    isOpen={
                        sidebarOpen
                    }

                    onClose={() =>
                        setSidebarOpen(false)
                    }
                />


                {/* =========================
                    Main Chat
                ========================= */}

                <main
                    className="
                        flex
                        min-h-0
                        min-w-0
                        flex-1
                        flex-col
                    "
                >

                    {/* =========================
                        Header
                    ========================= */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-3
                            border-b
                            border-blue-100
                            px-5
                            py-4

                            dark:border-white/10
                        "
                    >

                        {/* Mobile Menu Toggle */}

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            aria-label="Open conversations"
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
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
                            <Menu size={19} />
                        </button>


                        {/* Icon */}

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

                            <Sparkles
                                size={19}
                            />

                        </div>


                        {/* Title */}

                        <div className="min-w-0">

                            <h1
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    text-slate-900

                                    dark:text-white
                                "
                            >
                                {conversationTitle}
                            </h1>


                            <p
                                className="
                                    mt-0.5
                                    text-xs
                                    text-slate-500

                                    dark:text-slate-500
                                "
                            >

                                {activeConversation?.mediaId
                                    ? "Ask questions about your media"
                                    : "General AI conversation"}

                            </p>

                        </div>

                    </div>


                    {/* =========================
                        Messages Area
                    ========================= */}

                    <div
                        className="
                            custom-scrollbar
                            min-h-0
                            flex-1
                            overflow-y-auto
                            overflow-x-hidden
                            px-4
                            py-5
                            sm:px-5
                        "
                    >

                        {/* =========================
                            Conversation Error
                        ========================= */}

                        {conversationsError && (

                            <div
                                className="
                                    mx-auto
                                    mb-4
                                    max-w-3xl
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-sm
                                    text-red-600

                                    dark:border-red-500/20
                                    dark:bg-red-500/10
                                    dark:text-red-400
                                "
                            >
                                {conversationsError}
                            </div>

                        )}


                        {/* =========================
                            No Conversation
                        ========================= */}

                        {!activeConversation &&
                            !conversationsLoading && (

                                <div
                                    className="
                                        flex
                                        min-h-full
                                        flex-col
                                        items-center
                                        justify-center
                                        px-4
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            mb-5
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-blue-50
                                            text-blue-500

                                            dark:bg-blue-500/10
                                            dark:text-blue-400
                                        "
                                    >

                                        <Bot
                                            size={32}
                                        />

                                    </div>


                                    <h2
                                        className="
                                            text-xl
                                            font-semibold
                                            text-slate-900

                                            dark:text-white
                                        "
                                    >
                                        How can I help?
                                    </h2>


                                    <p
                                        className="
                                            mt-2
                                            max-w-md
                                            text-sm
                                            leading-6
                                            text-slate-500

                                            dark:text-slate-400
                                        "
                                    >
                                        Ask questions about
                                        your media or start
                                        a general AI
                                        conversation.
                                    </p>

                                </div>

                            )}


                        {/* =========================
                            Loading Conversation
                        ========================= */}

                        {conversationsLoading &&
                            !activeConversation && (

                                <div
                                    className="
                                        flex
                                        min-h-full
                                        items-center
                                        justify-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-slate-500

                                            dark:text-slate-400
                                        "
                                    >

                                        <div
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-blue-200
                                                border-t-blue-600

                                                dark:border-white/10
                                                dark:border-t-blue-500
                                            "
                                        />

                                        Loading conversation...

                                    </div>

                                </div>

                            )}


                        {/* =========================
                            Loading Messages
                        ========================= */}

                        {activeConversation &&
                            messagesLoading && (

                                <div
                                    className="
                                        flex
                                        min-h-full
                                        items-center
                                        justify-center
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-slate-500

                                            dark:text-slate-400
                                        "
                                    >

                                        <div
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                                rounded-full
                                                border-2
                                                border-blue-200
                                                border-t-blue-600

                                                dark:border-white/10
                                                dark:border-t-blue-500
                                            "
                                        />

                                        Loading messages...

                                    </div>

                                </div>

                            )}


                        {/* =========================
                            Empty Conversation
                        ========================= */}

                        {activeConversation &&
                            !messagesLoading &&
                            messages.length === 0 && (

                                <div
                                    className="
                                        flex
                                        min-h-full
                                        flex-col
                                        items-center
                                        justify-center
                                        text-center
                                    "
                                >

                                    <div
                                        className="
                                            mb-4
                                            flex
                                            h-12
                                            w-12
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-violet-50
                                            text-violet-500

                                            dark:bg-violet-500/10
                                            dark:text-violet-400
                                        "
                                    >

                                        <Sparkles
                                            size={24}
                                        />

                                    </div>


                                    <p
                                        className="
                                            text-sm
                                            text-slate-500

                                            dark:text-slate-400
                                        "
                                    >
                                        Start the conversation.
                                    </p>

                                </div>

                            )}


                        {/* =========================
                            Message List
                        ========================= */}

                        <div
                            className="
                                mx-auto
                                flex
                                max-w-3xl
                                flex-col
                                space-y-4
                            "
                        >

                            {!messagesLoading &&
                                messages.map(
                                    (message) => (

                                        <div
                                            key={message._id}
                                        >

                                            <MessageBubble
                                                message={message}
                                            />

                                            {message.role === "assistant" && (
                                                <MessageSources
                                                    sources={
                                                        message.sources
                                                    }
                                                />
                                            )}

                                        </div>

                                    )
                                )}


                            {/* =========================
                                AI Thinking
                            ========================= */}

                            {sending && (

                                <div
                                    className="
                                        flex
                                        justify-start
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            rounded-2xl
                                            rounded-bl-md
                                            border
                                            border-blue-100
                                            bg-white
                                            px-4
                                            py-3
                                            text-sm
                                            text-slate-500
                                            shadow-sm

                                            dark:border-white/10
                                            dark:bg-white/3
                                            dark:text-slate-400
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-1
                                            "
                                        >

                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    animate-bounce
                                                    rounded-full
                                                    bg-violet-500
                                                "
                                            />

                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    animate-bounce
                                                    rounded-full
                                                    bg-violet-500
                                                    [animation-delay:150ms]
                                                "
                                            />

                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    animate-bounce
                                                    rounded-full
                                                    bg-violet-500
                                                    [animation-delay:300ms]
                                                "
                                            />

                                        </div>

                                        AI is thinking...

                                    </div>

                                </div>

                            )}


                            {/* =========================
                                Message Error
                            ========================= */}

                            {messagesError && (

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        px-4
                                        py-3
                                        text-sm
                                        text-red-600

                                        dark:border-red-500/20
                                        dark:bg-red-500/10
                                        dark:text-red-400
                                    "
                                >
                                    {messagesError}
                                </div>

                            )}


                            {/* =========================
                                Scroll Target
                            ========================= */}

                            <div
                                ref={
                                    messagesEndRef
                                }
                                className="h-px"
                            />

                        </div>

                    </div>


                    {/* =========================
                        Input
                    ========================= */}

                    <div
                        className="
                            shrink-0
                            border-t
                            border-blue-100
                            bg-white
                            p-4

                            dark:border-white/10
                            dark:bg-[#0c0c0f]
                        "
                    >

                        <div
                            className="
                                mx-auto
                                max-w-3xl
                            "
                        >

                            <ChatInput
                                onSend={
                                    handleSend
                                }
                                disabled={
                                    sending
                                }
                            />

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Chat;