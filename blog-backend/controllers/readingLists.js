const router = require('express').Router()
const findReadingList = require('../util/entityFinder')
const { ReadingList, Blog, User } = require('../models')
const tokenExtractor = require('../util/tokenExtractor')
const sessionExtractor = require('../util/sessionExtractor')

router.get('/', async (req, res) => {
  const readingLists = await ReadingList.findAll();
  res.json(readingLists);
})

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body;

  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(400).json({ error: 'Blog not found' });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const readingList = await ReadingList.create({ blogId, userId });
  return res.json(readingList);
})

router.put('/:id', findReadingList(ReadingList), tokenExtractor, sessionExtractor, async (req, res) => {
  const user = await User.findByPk(req.session.userId, {
    include: [{
      model: ReadingList,
    }]
  })

  const readingList = user.ReadingLists.find(list => list.userId === req.ReadingList.userId);
  if (!readingList) {
    throw new Error('ReadingList not found');
  }

  if (!req.body.hasOwnProperty('isRead')) {
    throw new Error('isRead is required');
  }

  req.ReadingList.isRead = req.body.isRead;

  const content = await req.ReadingList.save();

  res.json({ content })
})

module.exports = router