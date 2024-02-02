const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    console.log(authorization.substring(7))
    console.log(SECRET)
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    if (!req.decodedToken) throw Error("token invalid")
  } else {
    throw Error("token missing")
  }

  next()
}

module.exports = tokenExtractor