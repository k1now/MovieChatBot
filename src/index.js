import { getEmbeddings } from './embedding.js';
import { processAndStoreMovies, findMostSimilarMovie } from './dbops.js';
import { getChatCompletion, classifyQuery } from './chatCompletion.js';

// Global flag for new movies
let newMovieAdded = false;  // Set to true initially to process movies on first run

export async function processQuery(userQuery) {
    try {
        // Process new movies if flag is set
        if (newMovieAdded) {
            console.log('New movies detected, updating database...');
            await processAndStoreMovies();
            newMovieAdded = false; // Reset the flag
        }

        // Classify the query
        console.log('Processing steps:');
        console.log('1. Classifying query...');
        const queryType = await classifyQuery(userQuery);
        console.log('   Query classified as:', queryType);

        if (queryType === 'movie_request') {
            // Generate embedding for the query
            console.log('2. Generating embedding for query...');
            const queryEmbedding = (await getEmbeddings([{ pageContent: userQuery }]))[0].embedding;

            // Find most similar movie
            console.log('3. Finding best match...');
            const bestMatch = await findMostSimilarMovie(queryEmbedding);

            if (bestMatch) {
                console.log('4. Getting AI response...');
                const response = await getChatCompletion(userQuery, bestMatch);
                return response;
            } else {
                console.log('\nNo matching movies found.');
                const response = await getChatCompletion(userQuery);
                return response;
            }
        } else {
            // Handle follow-up questions and casual conversation using conversation history
            console.log('2. Getting AI response...');
            const response = await getChatCompletion(userQuery);
            return response;
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
