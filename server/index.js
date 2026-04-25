const { env } = require('./src/config/env');
const { connectDb } = require('./src/config/db');
const { createApp } = require('./src/app');

async function bootstrap() {
  const db = await connectDb();
  const app = createApp({ db });
  app.listen(env.port, () => {
    console.log(`Rbooking server running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Server bootstrap failed:', error);
  process.exit(1);
});
