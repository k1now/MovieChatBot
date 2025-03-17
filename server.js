import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { processQuery } from './src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required' 
            });
        }

        // Process the message using our existing logic
        const response = await processQuery(message);
        
        res.json({ 
            message: response,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('Error processing chat message:', error);
        res.status(500).json({ 
            error: 'Failed to process message' 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
}); 