require('dotenv').config()

const { User, Anime } = require('../models')
const sequelize = require('../db')

async function seeder() {
  await sequelize.sync({ force: true })

  console.log('----Seeding Data----')

  try {
    await User.register(new User({ firstName: 'John', lastName: 'Doe', username: 'johndoe', email: 'johndoe@gmail.com' }), 'password1234')
    await User.register(new User({ firstName: 'Jane', lastName: 'Doe',username: 'janedoe', email: 'janedoe@gmail.com' }), 'password4321')
    await User.register(new User({ firstName: 'Jack', lastName: 'Doe',username: 'jackdoe', email: 'jackdoe@gmail.com' }), 'rootroot')
    await Anime.bulkCreate(require('./seeds.js'))
  } catch (err) {
    console.log(err)
  }


  console.log('----Data Seeded----')

  process.exit()
}

seeder()