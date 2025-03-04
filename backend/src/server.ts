import App from "./app";
import {logger} from "./utils/logger";

try {
    const app = new App();
    app.initializeRoutes();

  } catch (error) {
    logger.error(error);
  }
  