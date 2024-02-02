const router = require('express').Router()
const bcrypt = require('bcrypt')
const findUser = require('../util/entityFinder')
const { Op } = require('sequelize');
const { User, Blog, ReadingList } = require('../models')

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
        isRead: req.query !== undefined ? isRead : { [Op.ne]: null },
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

router.delete('/:id', findUser(User), async (req, res) => {
  req.user.destroy()
  res.status(204).end()
})

router.put('/:username', findUser(User, 'username'), async (req, res) => {
  if (!req.body.name) throw Error('name is required')
  req.user.name = req.body.name
  await req.user.save()
  res.json({ name: req.user.name })
})

module.exports = router