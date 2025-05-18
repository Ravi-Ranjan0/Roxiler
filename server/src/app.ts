import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:5173']; // Your frontend origin

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow REST tools or server-to-server requests with no origin
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
   credentials: true, 
}));

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

import adminRoutes from './routes/admin.route';
import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import ratingRoutes from './routes/rating.route';
import storeRoutes from './routes/store.route';

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/store', storeRoutes);


export default app;