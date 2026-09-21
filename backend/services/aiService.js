import {
    GoogleGenAI
} from "@google/genai";


const ai = new GoogleGenAI({
    apiKey:
        process.env.GEMINI_API_KEY
});


// =========================
// Generate AI Response
// =========================

export const generateAIResponse = async ({
    messages,
    context
}) => {

    try {

        // =========================
        // 1. Build conversation history
        // =========================

        const conversation =
            messages.map(
                message => ({

                    role:
                        message.role ===
                            "assistant"
                            ? "model"
                            : "user",

                    parts: [
                        {
                            text:
                                message.content
                        }
                    ]
                })
            );


        // =========================
        // 2. Build Library Context
        // =========================

        let libraryContext = `
NO_RELEVANT_LIBRARY_INFORMATION

There is no relevant information available
from the user's library for this question.

You MUST NOT use general knowledge to answer
the question.
`;


        if (
            context &&
            context.length
        ) {

            libraryContext =
                context
                    .map(
                        (chunk, index) => {

                            const mediaName =
                                chunk.mediaId
                                    ?.originalName ||
                                "Unknown file";

                            const mediaId =
                                chunk.mediaId
                                    ?._id ||
                                chunk.mediaId;


                            return `
SOURCE ${index + 1}

SOURCE FILE:
${mediaName}

SOURCE MEDIA ID:
${mediaId}

RELEVANCE SCORE:
${chunk.score.toFixed(3)}

CONTENT:
${chunk.text}
                            `;
                        }
                    )
                    .join("\n\n");
        }


        // =========================
        // 3. Add RAG Context
        // =========================

        const lastMessage =
            conversation[
            conversation.length - 1
            ];


        if (
            lastMessage &&
            lastMessage.role === "user"
        ) {

            lastMessage.parts.push({

                text: `
                
RELEVANT INFORMATION FROM THE
USER'S PERSONAL LIBRARY:

${libraryContext}

IMPORTANT RULES FOR THIS LIBRARY CONTEXT:

1. Answer the user's question using
   the relevant information provided
   above.

2. You may combine information from
   multiple sources when necessary.

3. Keep track of which source contains
   each piece of information.

4. When the answer comes from a specific
   file, mention the file name naturally
   in your answer when useful.

5. If information comes from multiple
   files, make it clear which information
   came from which file when appropriate.

6. Do not invent facts.

7. If the answer cannot be found in the
   provided library context, clearly tell
   the user that you could not find the
   answer in their library.

8. Do not claim that you analyzed a file
   if the provided context does not contain
   relevant information from that file.
                `
            });
        }


        // =========================
        // 4. Ask Gemini
        // =========================

        const response =
            await ai.models.generateContent({

                model:
                    process.env.GEMINI_MODEL,

                contents:
                    conversation,

                config: {

                    systemInstruction: `
You are a strict AI assistant inside an
AI Media Assistant application.

Your primary purpose is to answer questions
using ONLY information available in the user's
personal library context.

The user's library may contain PDFs and images.

STRICT KNOWLEDGE BOUNDARY:

1. The USER'S PERSONAL LIBRARY CONTEXT is your
   ONLY source of factual information.

2. Do NOT use your general knowledge to answer
   a question when the answer is not present in
   the provided library context.

3. Do NOT provide explanations, definitions,
   examples, facts, or instructions from your
   own knowledge if they are not supported by
   the library context.

4. If the user's question cannot be answered
   from the provided library context, respond
   clearly that the information was not found
   in the user's library.

5. Never fill missing information with your
   own knowledge.

6. Never guess or make assumptions about
   information that is not present in the
   library context.

LIBRARY CONTEXT:

The library context is provided with the user's
latest message.

If the library context says:

"No relevant information was found in the
user's library."

then you MUST NOT answer the user's question
using general knowledge.

Instead, tell the user that you could not find
the requested information in their library.

RELEVANCE:

7. Do not assume that every provided source is
   relevant to the question.

8. Only use information from a source when that
   source actually contains information needed
   to answer the question.

9. If the provided sources do not contain enough
   information to answer the question, say that
   the answer was not found in the user's library.

10. Never force an unrelated source into the
    answer.

CONVERSATION HISTORY:

11. Use conversation history to understand
    follow-up questions such as "this", "that",
    "it", "they", or similar references.

12. However, conversation history must not be
    treated as a source of factual information
    about the user's library unless that
    information was originally provided from
    the library context.

SOURCES:

13. When information is taken from a library
    source, you may mention the source file name
    naturally.

14. If multiple library sources are used,
    distinguish between them when appropriate.

15. Never invent a source or claim that a file
    contains information that it does not contain.

16. Never mention internal implementation details
    such as embeddings, vector search, RAG,
    prompts, similarity scores, or retrieval.

RESPONSE STYLE:

17. Keep responses concise and useful.

18. Explain information simply unless the user
    asks for more detail.

19. If the answer is not available in the
    library, use a response such as:

    "I couldn't find that information in
    your library."

20. Do not answer outside the library context
    simply because you know the answer yourself.
`
                }
            });


        // =========================
        // 5. Validate Response
        // =========================

        if (!response.text) {

            throw new Error(
                "AI did not return a response"
            );
        }


        // =========================
        // 6. Return
        // =========================

        return {

            content:
                response.text.trim()

        };

    } catch (error) {

        console.error(
            "Gemini API error:",
            error
        );

        throw new Error(
            "Unable to generate AI response"
        );
    }
};