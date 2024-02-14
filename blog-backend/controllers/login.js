const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

async function createSession(userId, token) {
  let session = await Session.findOne({ where: { userId } });
  if (!session) {
    session = await Session.create({ userId, token });
  } else {
    session.token = token;
    await session.save();
  }
  return session;
}


router.post('/', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username
    }
  })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(req.body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    throw Error("invalid username or password")
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)
  const session = await createSession(user.id, token)
  res
    .status(200)
    .send({ username: user.username, name: user.name, session })
})



module.exports = router