const router = require('express').Router()
const bcrypt = require('bcrypt')
const findUser = require('../util/entityFinder')
const { Op } = require('sequelize');
const { User, Blog, ReadingList, Session } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')
const sessionExtractor = require('../util/sessionExtractor')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const saltRounds = 10
  req.body.passwordHash = await bcrypt.hash(req.body.password, saltRounds)
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', findUser(User), async (req, res) => {
  const { name, username } = req.user
  const { isRead } = req.query

  const blogs = await Blog.findAll({
    attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
    include:
    {
      model: ReadingList,
      attributes: ['id', 'isRead'],
      where: {
        isRead: isRead !== undefined ? isRead : { [Op.ne]: null },
      }
    }, where: {
      id: req.user.ReadingLists.map(list => list.blogId)
    }
  })
  res.json(
    {
      name: name,
      username: username,
      readings: blogs
    })
})

router.delete('/:id', findUser(User), tokenExtractor, sessionExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user.id) throw Error('Unauthorized')

  req.user.destroy()
  res.status(204).end()
})

// router.put('/:username', findUser(User, 'username'), async (req, res) => {
//   if (!req.body.name) throw Error('name is required')
//   req.user.name = req.body.name
//   await req.user.save()
//   res.json({ name: req.user.name })
// })

router.put('/:id', findUser(User), async (req, res) => {

  if (!req.user) throw Error('User not found')
  console.log("enabled?", req.user.enabled)
  req.user.enabled = !req.user.enabled
  await req.user.save()
  res.json({ name: req.user.name, enabled: req.user.enabled })
})

module.exports = router