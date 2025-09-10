import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/foods.routes.js';
import foodPartnerRoutes from './routes/food-partner.routes.js';
import cors from 'cors';
import path from 'path';

const app = express();
const __dirname = path.resolve();

app.use(cors({
    origin: 'https://eatsy-foodreel-web.onrender.com/',
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Hello world');
// });

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Fix: catch-all route
app.get('/*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

export default app;
