const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

const ReadingList = sequelize.define('ReadingList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  }
}, {
  underscored: true,
  timestamps: false,
  tableName: 'reading_list'
});

module.exports = ReadingList;
