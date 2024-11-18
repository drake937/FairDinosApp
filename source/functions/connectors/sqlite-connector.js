const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../../data/database.sqlite'), // Adjust path accordingly
  logging: false, // Disable logging for cleaner console output
});

module.exports = sequelize;
