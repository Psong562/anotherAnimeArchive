const User = require('./User.js')
const Friend = require('./Friend.js')
const Anime = require('./Anime.js')


User.hasMany(Anime, { foreignKey: 'uid' })
Anime.belongsTo(User, { foreignKey: 'uid' })
User.hasMany(Friend, { foreignKey: 'uid' })
//Friend.belongsToMany(User, { foreignKey: 'uid' })


module.exports = { User, Anime, Friend }