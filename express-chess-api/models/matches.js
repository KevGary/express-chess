'use strict';
module.exports = function(sequelize, DataTypes) {
  var Matches = sequelize.define('Matches', {
    w_userID: DataTypes.INTEGER,
    b_userID: DataTypes.INTEGER,
    gameID: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Matches.belongsTo(models.Users);
        Matches.belongsTo(models.Games);
      }
    }
  });
  return Matches;
};