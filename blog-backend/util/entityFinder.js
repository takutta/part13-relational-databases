const { ReadingList } = require('../models')

const entityFinder = (model, findBy = 'id') => async (req, _res, next) => {
  let entity

  if (findBy === 'id' && model.name === "user") {

    entity = await model.findByPk(req.params.id, {
      attributes: ['id', 'username', 'name', 'enabled'],
      include: [{
        model: ReadingList,
      }]
    })
  }
  else if (findBy === 'username') {
    entity = await model.findOne({
      where: {
        username: req.params[findBy]
      },
    })
  }
  else {
    entity = await model.findByPk(req.params[findBy])

  }

  if (!entity) throw new Error(`${model.name} not found`)

  req[model.name] = entity
  next();
};

module.exports = entityFinder;
