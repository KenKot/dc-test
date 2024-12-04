const PORT = 4000;
require("dotenv").config();
const connectDB = require("./config/database.js");
//

const express = require("express");
const app = express();

app.use(express.json()); // parse JSON bodies

app.use("/api/auth", require("./routes/auth.js"));

connectDB();

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
