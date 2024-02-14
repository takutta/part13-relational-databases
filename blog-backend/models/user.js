const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: {
        args: [true],
        msg: "Username must be an email address"
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  underscored: true,
  timestamps: true,
  tableName: 'users'
});

module.exports = User