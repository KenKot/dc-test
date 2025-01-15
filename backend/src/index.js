const app = require("./app"); // App configuration
const { PORT } = require("./config/envConfig");
const logger = require("./utils/logger");

app.listen(PORT, () => {
  logger.info(`Server is running on port: ${PORT}`);
});
