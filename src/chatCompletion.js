import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Initialize messages array with system message
const messages = [
    {
        role: "system",
        content: `You are a friendly movie enthusiast chat assistant that always gives responses shorter than 150 tokens. Your behavior should follow these rules:

1. For movie-related queries:
   - Provide friendly and insightful responses about why a movie matches the user's preferences
   - Only use information from the movie descriptions provided
   - Keep responses concise and focused on the most relevant details
   - Limit responses to 2-3 key points about the movie

2. For follow-up questions:
   - Use the context from previous messages in the conversation
   - Reference the movie discussed in the previous exchanges
   - Keep responses focused on answering the specific follow-up question
   - For lists or bullet points, limit to 3 items maximum
   - Each point should be 1-2 sentences only

3. For casual conversation:
   - Be friendly and engaging but brief
   - Keep responses natural and conversational
   - Guide the conversation towards movies when appropriate
   - If asked about personal experiences or opinions, remind the user that you're an AI assistant

4. Never make up information:
   - If you don't know something, say "I'm not sure about that" or "I don't have that information"
   - Only discuss movies based on the descriptions provided
   - Don't make assumptions about movie details not included in the descriptions

5. Response Format:
   - Keep all responses concise and under 150 tokens
   - Focus on the most important information first
   - Break complex responses into short, clear points
   - Avoid lengthy explanations or unnecessary details`
    }
];

export async function classifyQuery(userQuery) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "system",
                    content: "You are a query classifier. Classify the user's message into one of three categories: 'movie_request' (if they're asking for a movie recommendation), 'follow_up' (if they're asking about a previously discussed movie), or 'casual' (if it's general conversation). Respond ONLY with one of these three words."
                },
                {
                    role: "user",
                    content: userQuery
                }
            ],
            temperature: 0,
            max_tokens: 10
        });

        return response.choices[0].message.content.trim().toLowerCase();
    } catch (error) {
        console.error('Error in query classification:', error);
        throw error;
    }
}

export async function getChatCompletion(userQuery, bestMatch = null) {
    // Add user's message to conversation history
    messages.push({
        role: "user",
        content: bestMatch 
            ? `User Query: ${userQuery}\nSimilar Movie: ${bestMatch.content}` // For new movie requests
            : userQuery // For follow-ups and casual conversation
    });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: messages,
            temperature: 0.5,
            max_tokens: 150
        });

        // Add assistant's response to conversation history
        messages.push(response.choices[0].message);
        
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error in getChatCompletion:', error);
        throw error;
    }
}   