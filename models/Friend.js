const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Friend extends Model { }
Friend.init({
  list: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, { sequelize, modelName: 'friend' })

module.exports = Friend