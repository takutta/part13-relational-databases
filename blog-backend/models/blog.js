const { DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

const Blog = sequelize.define('blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1991],
        msg: 'Year must be at least 1991'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: "Year can't be in the future"
      }
    }
  },
}, {
  underscored: true,
  timestamps: true,
  tableName: 'blogs'
});

module.exports = Blog;
