require('dotenv').config({
  path: '../.env',
});
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

const db = {};
db.sequelize = sequelize;

db.models = {};
db.models.User = require('../models/user.js')(sequelize, Sequelize.DataTypes);

module.exports = db;
