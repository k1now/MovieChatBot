import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export async function chunkMovieData(text) {
    try {
        // Split the text on double newlines and filter out empty chunks
        const chunks = text
            .split('\n\n')
            .filter(chunk => chunk.trim().length > 0)
            .map(content => ({
                pageContent: content.trim(),
                metadata: {}  // Keeping the same structure as LangChain for compatibility
            }));
        
        return chunks;
    } catch (error) {
        console.error('Error chunking movie data:', error);
        throw error;
    }
}
