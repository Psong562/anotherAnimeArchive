const router = require('express').Router()
const { Anime, User } = require('../models')
const passport = require('passport')

// GET all Animes
router.get('/animes', passport.authenticate('jwt'), async function (req, res) {
  const animes = await Anime.findAll({ include: [User] })
  res.json (animes)
})

// Post one Anime
router.post('/animes', passport.authenticate('jwt'), async function ({ body, user }, res) {
  const anime = await Anime.create({
    ...body,
    uid: user.id
  })
  res.sendStatus(200)
  // res.json (anime)

})

// DELETE one Anime
router.delete('/animes/:id', passport.authenticate('jwt'), async function ({ params: { id } }, res) {
  await Anime.destroy({ where: { id } })
  res.sendStatus(200)
})

module.exports = router