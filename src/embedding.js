import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function getEmbeddings(chunks) {
    try {
        // Extract just the text content from chunks to embed
        const textsToEmbed = chunks.map(chunk => chunk.pageContent);

        // Get embeddings from OpenAI API
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: textsToEmbed,
        });

        // Combine the original chunks with their embeddings
        const chunksWithEmbeddings = chunks.map((chunk, index) => ({
            ...chunk,
            embedding: response.data[index].embedding
        }));

        return chunksWithEmbeddings;
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw error;
    }
} 