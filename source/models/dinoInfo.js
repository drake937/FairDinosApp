const { DataTypes } = require('sequelize');
const sequelize = require('../functions/connectors/sqlite-connector'); // Ensure this points to your SQLite connector

const DinoInfo = sequelize.define('DinoInfo', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Equivalent to `required: true`
  },
  codeName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Makes sure codeName is unique
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  survival: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  tier: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  diet: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = DinoInfo;
