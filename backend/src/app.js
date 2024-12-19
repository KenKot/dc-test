const morgan = require("morgan"); //testing

const PORT = 4000;
require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database.js");

const express = require("express");
const app = express();

// MIDDLEWARES
app.use(morgan("dev")); //testing
app.use(cookieParser());
app.use(express.json()); // parse JSON bodies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/admin", require("./routes/admin.js"));

connectDB();

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
