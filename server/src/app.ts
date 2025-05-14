import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors(
    {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    }
));

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));



export default app;