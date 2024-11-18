const { DataTypes } = require('sequelize');
const sequelize = require('../functions/connectors/sqlite-connector');

const User = sequelize.define('User', {
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  steamId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cash: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default cash balance
    allowNull: false,
  },
  bank: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default bank balance
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = User;
