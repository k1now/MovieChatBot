# MovieChatBot: RAG-Powered Semantic Search chat bot with OpenAI Vector Embeddings and ChatCompletion API

A sophisticated movie recommendation chatbot that leverages Retrieval-Augmented Generation (RAG), vector embeddings, and OpenAI's ChatCompletion API to provide intelligent movie suggestions and engage in natural conversations about films.

## Technical Stack

- **RAG (Retrieval-Augmented Generation)**: Combines retrieval of relevant movie information with generative AI for accurate responses
- **Vector Database**: Utilizes embeddings to create a semantic search space for movies
- **OpenAI API**: 
  - Embeddings API for converting text to vector representations
  - ChatCompletion API for generating contextual responses
- **Cosine Similarity**: Used to find the most semantically similar movies to user queries
- **Express.js**: Backend server for handling API requests
- **React**: Frontend for an interactive chat interface

## Features

- **Semantic Search**: Uses vector embeddings to understand user queries and find relevant movies
- **Contextual Responses**: Maintains conversation context for follow-up questions
- **Natural Language Processing**: Classifies queries into categories (movie_request, follow_up, casual)
- **Real-time Processing**: Dynamic embedding generation and similarity matching
- **Interactive UI**: Clean, responsive chat interface

## How It Works

1. **Query Processing**:
   - User input is classified into query types
   - For movie requests, generates embeddings for semantic matching

2. **Vector Search**:
   - Converts movie descriptions into vector embeddings
   - Uses cosine similarity to find the most relevant matches

3. **Response Generation**:
   - Retrieves relevant movie information
   - Uses OpenAI's ChatCompletion API to generate contextual responses

4. **Context Management**:
   - Maintains conversation history
   - Handles follow-up questions intelligently

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/k1now/MovieChatBot.git
   cd MovieChatBot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the server:
   ```bash
   node server.js
   ```

5. Access the application:
   Open `http://localhost:3000` in your browser

## API Endpoints

- `POST /api/chat`: Main endpoint for processing chat messages
- `GET /api/test`: Test endpoint to verify API functionality

## Technical Details

### Embedding Generation
- Uses OpenAI's text-embedding-ada-002 model
- Converts movie descriptions into 1536-dimensional vectors

### Similarity Matching
- Implements cosine similarity for vector comparison
- Returns top matches based on semantic similarity

### Query Classification
- Categorizes user input into:
  - movie_request: Direct queries about movies
  - follow_up: Questions about previously discussed movies
  - casual: General conversation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 