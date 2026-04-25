const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const { env } = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const listingRoutes = require('./routes/listing.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const bookingRoutes = require('./routes/booking.routes');
const threadRoutes = require('./routes/thread.routes');
const authRoutes = require('./routes/auth.routes');

function createApp({ db }) {
  const app = express();
  app.locals.db = db;

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: env.clientOrigin === '*' ? true : env.clientOrigin,
      credentials: false,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

  app.use('/api', healthRoutes);
  app.use('/api', listingRoutes);
  app.use('/api', dashboardRoutes);
  app.use('/api', bookingRoutes);
  app.use('/api', threadRoutes);
  app.use('/api', authRoutes);

  app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));
  app.use((err, _req, res, _next) =>
    res.status(500).json({ error: err?.message || 'Internal server error' }),
  );

  return app;
}

module.exports = { createApp };
