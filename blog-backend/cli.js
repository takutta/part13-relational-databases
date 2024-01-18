require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres', logging: false })

class Blog extends Model { }

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  title: {
    type: DataTypes.DATE,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0

  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const main = async () => {
  try {
    const blogs = await Blog.findAll()
    const blogTexts = blogs.map(blog => `${blog.author}: '${blog.title}', ${blog.likes} likes`)
    console.log(blogTexts.join('\n'))
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()