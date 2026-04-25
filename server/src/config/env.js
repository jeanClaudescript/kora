const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4001),
  mongoUri:
    process.env.MONGODB_URI ||
    'mongodb+srv://jeanclude:32r1pI9IYjzqMYgv@cluster0.xuewx8h.mongodb.net/',
  mongoDb: process.env.MONGODB_DB || 'rbooking',
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
};

module.exports = { env };
