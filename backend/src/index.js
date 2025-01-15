const app = require("./app"); // Import the app configuration
const PORT = 4000; // Use environment variable for port, or default to 4000

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
