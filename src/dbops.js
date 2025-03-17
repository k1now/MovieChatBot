import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { chunkMovieData } from './textChunker.js';
import { getEmbeddings } from './embedding.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
);

export async function processAndStoreMovies() {
    try {
        // Read and process movies
        const moviesText = await readFile(join(__dirname, '../moviesList.txt'), 'utf-8');
        
        console.log('Chunking movie data...');
        const movieChunks = await chunkMovieData(moviesText);
        
        console.log('Generating embeddings for movies...');
        const chunksWithEmbeddings = await getEmbeddings(movieChunks);
        
        console.log('Storing embeddings in database...');
        await storeMovieEmbeddings(chunksWithEmbeddings);
        
        console.log('Database update completed successfully!');
    } catch (error) {
        console.error('Error processing and storing movies:', error);
        throw error;
    }
}

/**
 * Store movie data and their embeddings in Supabase
 */
export async function storeMovieEmbeddings(movies) {
    for (const movie of movies) {
        try {
            // Check if movie already exists
            const { data: existingMovies } = await supabase
                .from('movieslist')
                .select('content')
                .eq('content', movie.pageContent);

            if (existingMovies && existingMovies.length > 0) {
                console.log('Skipped existing movie:', movie.pageContent);
                continue;
            }

            // Insert new movie
            const { error } = await supabase
                .from('movieslist')
                .insert([
                    {
                        content: movie.pageContent,
                        embedding: movie.embedding
                    }
                ]);

            if (error) throw error;

        } catch (error) {
            console.error('Error storing movie:', error);
            throw error;
        }
    }
}

/**
 * Find the most similar movie based on a query embedding
 */
export async function findMostSimilarMovie(queryEmbedding) {
    try {
        const { data: movies, error } = await supabase.rpc('match_movieslist', {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: 1
        });

        if (error) throw error;

        return movies[0]; // Return the best match
    } catch (error) {
        console.error('Error finding similar movie:', error);
        throw error;
    }
} 