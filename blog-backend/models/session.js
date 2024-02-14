const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id',
    }
  }
}, {
  tableName: 'sessions',
}
)
module.exports = Session