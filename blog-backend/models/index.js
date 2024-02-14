const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readingList')
const Session = require('./session')


User.hasMany(Blog)
Blog.belongsTo(User)

User.hasMany(ReadingList)
ReadingList.belongsTo(User)

Blog.hasMany(ReadingList, { onDelete: 'CASCADE' });
ReadingList.belongsTo(Blog, { onDelete: 'CASCADE' });

User.belongsToMany(Blog, { through: ReadingList });
Blog.belongsToMany(User, { through: ReadingList });

User.hasOne(Session);
Session.belongsTo(User);

module.exports = {
  Blog, User, ReadingList, Session
}
