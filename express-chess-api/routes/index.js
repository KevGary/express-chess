var express = require('express');
var router = express.Router();
var cors = require('cors');

//jwt
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jwtSecret = 'yoyoyoyoyooyoy';
//protected
router.use(expressJwt({secret: jwtSecret}).unless({ path: [ '/login', '/register', '/favicon.ico' ] }));

//pg config
var pg = require('pg');
var conString = 'postgres://@localhost/chess_db';

//bcrypt
var bcrypt = require('bcrypt');


//-------JWT AUTH--------
router.post('/login', function(req, res, next) {
  if(req.body.user.email == "" || req.body.user.password == "") {
    res.status(400).end('Must provide username and password');
  }
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM users WHERE username = $1', [req.body.user.username], function(err, result) {
      if (err) {
        return console.error('error running query', err);
      } else if (result.rows.length < 1) {
        res.status(400).end('User not found');
      } else {
        var hash = result.rows[0].password; 
        bcrypt.compare(req.body.user.password, hash, function(err, bcryptRes) {
          if(err || bcryptRes == false) {
            res.status(400).end('Password incorrect');
          }
          if(bcryptRes == true) {
            client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [req.body.user.username, hash], function(err, result) {
              done();
              if (err) {
                return console.error('error running query', err);
              } else if (result.rows.length < 1) {
                res.status(400).end('User or password incorrect');
              } else if (bcryptRes == true) {
                var token = jwt.sign({
                  username: result.rows[0].username,
                  id: result.rows[0].id
                }, jwtSecret);
                client.query('UPDATE users SET token = $2  WHERE id = $1', [result.rows[0].id, token], function(err, result) {
                  done();
                  if (err) {
                    return console.error('error running query', err);
                  }
                  res.send({
                    token: token
                  });
                });
              }
            });
          }
        });
      }
    });
  });
});

//register
router.post('/register', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    bcrypt.hash(req.body.user.password, 8, function(err, hash) {
      client.query('INSERT INTO users(username, password, token) VALUES($1, $2, $3, $4) returning *', [req.body.user.username, hash, null], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        var token = jwt.sign({
          username: result.rows[0].username,
          id: result.rows[0].id
        }, jwtSecret);
        client.query('UPDATE users SET token = $2  WHERE id = $1', [result.rows[0].id, token], function(err, result) {
          done();
          if (err) {
            return console.error('error running query', err);
          }
          res.send({
            token: token
          });
        });
      });
    });
  });
});

router.get('/me', function (req, res) {
  res.send(req.user);
});


//-----------USERS--------
//get one user
router.get('/users/:id', function (req, res) {
  models.Users.find({
    where: {
      id: req.params.id
    }
  }).then(function (user) {
    res.json(user);
  });
});
//get all users
router.get('/users', function (req, res) {
  models.Users.findAll({}).then(function (user) {
    res.json(user);
  });
});
//post user
router.post('/users', function (req, res) {
  models.Users.create({
    username: req.body.username,
    password: req.body.password,
    token: null
  }).then(function (user) {
    res.json(user);
  });
});
router.put('/users/:id', function (req, res) {
  models.Users.find({
    where: {
      id: req.params.id
    }
  }).then(function (user) {
    if (user) {
      user.updateAttributes({
        email: req.body.email,
        password: req.body.password,
        token: req.body.token
      }).then(function (user) {
        res.json(user);
      });
    } else {
      res.json('user not found');
    }
  });
});
//delete one user
router.delete('/users/:id', function (req, res) {
  models.Users.destroy({
    where: {
      id: req.params.id
    }
  }).then(function (user) {
    res.json(user);
  });
});

//------GAMES-------
//get one game
router.get('/games/:id', function (req, res) {
  models.Games.find({
    where: {
      id: req.params.id
    }
  }).then(function (game) {
    res.json(game);
  });
});
//get all games
router.get('/games', function (req, res) {
  models.Games.figamendAll({}).then(function (game) {
    res.json(game);
  });
});
//post game
router.post('/games', function (req, res) {
  models.Games.create({
    moves: req.body.moves,
    result: req.body.result
  }).then(function (game) {
    res.json(game);
  });
});
//update one game
router.put('/games/:id', function (req, res) {
  models.Games.find({
    where: {
      id: req.params.id
    }
  }).then(function (game) {
    if (game) {
      game.updateAttributes({
        moves: req.body.moves,
        result: req.body.result
      }).then(function (game) {
        res.json(game);
      });
    } else {
      res.json('user not found');
    }
  });
});
//delete one game
router.delete('/games/:id', function (req, res) {
  models.Games.destroy({
    where: {
      id: req.params.id
    }
  }).then(function (game) {
    res.json(game);
  });
});


//----------MATCHES-----------
//get one match
router.get('/matches/:id', function (req, res) {
  models.Matches.find({
    where: {
      id: req.params.id
    }
  }).then(function (match) {
    res.json(match);
  });
});
//get all matches
router.get('/matches', function (req, res) {
  models.Games.figamendAll({}).then(function (match) {
    res.json(match);
  });
});
//post match
router.post('/matches', function (req, res) {
  models.Matches.create({
    w_userID: req.body.w_userID,
    b_userID: req.body.b_userID,
    gameID: req.body.gameID
  }).then(function (match) {
    res.json(match);
  });
});
//update one match
router.put('/matches/:id', function (req, res) {
  models.Matches.find({
    where: {
      id: req.params.id
    }
  }).then(function (match) {
    if (match) {
      match.updateAttributes({
        w_userID: req.body.w_userID,
        b_userID: req.body.b_userID,
        gameID: req.body.gameID
      }).then(function (match) {
        res.json(match);
      });
    } else {
      res.json('user not found');
    }
  });
});
//delete one match
router.delete('/matches/:id', function (req, res) {
  models.Matches.destroy({
    where: {
      id: req.params.id
    }
  }).then(function (match) {
    res.json(match);
  });
});


module.exports = router;
