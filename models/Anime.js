const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Anime extends Model { }
Anime.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  synopsis: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { sequelize, modelName: 'anime' })

module.exports = Anime