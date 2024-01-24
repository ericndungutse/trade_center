import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';

const PORT = process.env.PORT || 3000;

async function init() {
  try {
    await mongoose.connect(process.env.DB);
    console.log('🚀 Db connected');
  } catch (err) {
    console.log('ERROR 💥', err.message);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  await init();
  console.log('🚀 App runing on ', PORT, '...');
});
