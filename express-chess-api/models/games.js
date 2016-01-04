'use strict';
module.exports = function(sequelize, DataTypes) {
  var Games = sequelize.define('Games', {
    moves: DataTypes.STRING,
    result: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Games.hasOne(models.Matches);
      }
    }
  });
  return Games;
};