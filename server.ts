import errorHandler from "errorhandler";

import app from "./app";
import logger from "./util/logger.util";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    logger.silly(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
    logger.silly("  Press CTRL-C to stop");
});

export default server;
