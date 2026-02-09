import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import db from './models/index.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CureNet API' });
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connected and synced.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start().catch(console.error);
