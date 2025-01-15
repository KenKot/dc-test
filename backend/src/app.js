const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database.js");
const { CLIENT_URL } = require("./config/envConfig.js");

const express = require("express");
const app = express();

const middleware = require("./middlewares/middleware.js");
connectDB();

// MIDDLEWARES
app.use(middleware.reqLogger); //testing
app.use(cookieParser());
app.use(express.json()); // parse JSON bodies
app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/admin", require("./routes/admin.js"));
app.use("/api", require("./routes/profile.js"));

// app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
