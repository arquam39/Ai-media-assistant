import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-001";

const EMBEDDING_DIMENSION = 768;


// =========================
// Generate Embedding
// =========================

export const generateEmbedding = async (text) => {

    if (!text || !text.trim()) {
        throw new Error(
            "Text is required for embedding"
        );
    }

    const result =
        await ai.models.embedContent({

            model: EMBEDDING_MODEL,

            contents: text,

            config: {
                outputDimensionality:
                    EMBEDDING_DIMENSION
            }
        });

    const embedding =
        result.embeddings?.[0]?.values;

    if (!embedding) {
        throw new Error(
            "Failed to generate embedding"
        );
    }

    return embedding;
};


// =========================
// Generate Multiple Embeddings
// =========================

export const generateEmbeddings = async (texts) => {

    if (
        !Array.isArray(texts) ||
        !texts.length
    ) {
        return [];
    }

    const BATCH_SIZE = 100;

    const allEmbeddings = [];

    for (
        let i = 0;
        i < texts.length;
        i += BATCH_SIZE
    ) {

        const batch =
            texts.slice(
                i,
                i + BATCH_SIZE
            );

        console.log(
            `Generating embeddings: ${i + 1}-${i + batch.length} of ${texts.length}`
        );

        const result =
            await ai.models.embedContent({
                model: EMBEDDING_MODEL,
                contents: batch,
                config: {
                    outputDimensionality:
                        EMBEDDING_DIMENSION
                }
            });

        const embeddings =
            result.embeddings.map(
                embedding =>
                    embedding.values
            );

        allEmbeddings.push(
            ...embeddings
        );
    }

    return allEmbeddings;
};