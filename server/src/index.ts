import { config } from "./config/env";
import app from "./app";

const PORT = config.port;
const NODE_ENV = config.env;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT} in ${NODE_ENV} mode`);
  });
};

const start = async () => {
  try {
    startServer();
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

start();