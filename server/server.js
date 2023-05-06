const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/dbConfig.js');
const users = require('./routes/users.js');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', users);

// Start the server
db.sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
});
