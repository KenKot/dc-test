const PORT = 4000;

const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("YO");
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
