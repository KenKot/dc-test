const PORT = 4000;
require("dotenv").config();

const cookieParser = require("cookie-parser");
const connectDB = require("./config/database.js");

const express = require("express");
const app = express();

// MIDDLEWARES
app.use(cookieParser());
app.use(express.json()); // parse JSON bodies

app.use("/api/auth", require("./routes/auth.js"));

connectDB();

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
