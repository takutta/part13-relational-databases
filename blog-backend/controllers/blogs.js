const router = require('express').Router()
const { Blog, User } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')
const findBlog = require('../util/entityFinder')
const { Op } = require("sequelize");

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  console.log(blog)
  return res.json(blog)
})

router.get('/:id', findBlog(Blog), async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', findBlog(Blog), tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (req.blog.userId === user.id) {
    req.blog.destroy()
    res.status(204).end()
  }
  else {
    return res.status(401).json({ error: 'unauthorized' })
  }

})

router.put('/:id', findBlog(Blog), async (req, res) => {
  if (!req.body.likes) throw Error('likes is required')
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json({ likes: req.blog.likes })
})


module.exports = router