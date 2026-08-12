import "dotenv/config";
import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";



async function bootstrap() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();