const checkTimeDiff = require('../util/timeDiff')
const { Session } = require('../models')

const sessionExtractor = async (req, _res, next) => {
  const session = await Session.findOne({ where: { userId: req.decodedToken.id } });
  if (!session) throw Error("not logged in")
  if (checkTimeDiff(session.updatedAt, new Date(), 60)) {
    await session.destroy()
    throw Error("session expired")
  }
  session.changed('updatedAt', true);
  await session.save();
  req.session = session
  next();
}

module.exports = sessionExtractor