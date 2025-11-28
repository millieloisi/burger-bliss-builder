require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 4000;

// Bind to 0.0.0.0 so the server is reachable on localhost and other interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
