const router = require('express').Router()
const tokenExtractor = require('../util/tokenExtractor')
const sessionExtractor = require('../util/sessionExtractor')

router.delete('/', tokenExtractor, sessionExtractor, async (req, res) => {
  await req.session.destroy()
  res.status(204).end()
})

module.exports = router