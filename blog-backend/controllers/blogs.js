const router = require('express').Router()
const { Blog, User, ReadingList, Session } = require('../models')

const tokenExtractor = require('../util/tokenExtractor')
const sessionExtractor = require('../util/sessionExtractor')
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

router.post('/', tokenExtractor, sessionExtractor, async (req, res) => {
  const blog = await Blog.create({ ...req.body, userId: req.session.userId })
  return res.json(blog)
})

router.get('/:id', findBlog(Blog), async (req, res) => {
  res.json(req.blog)
})

router.delete('/:id', findBlog(Blog), tokenExtractor, sessionExtractor, async (req, res, next) => {
  if (req.blog.userId === user.id) {
    const readingLists = await ReadingList.findAll({ where: { blogId: req.blog.id } });
    for (let readingList of readingLists) {
      await readingList.destroy();
    }
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