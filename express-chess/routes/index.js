var express = require('express');
var router = express.Router();

//jwt
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var jwtSecret = 'yoyoyoyoyooyoy';
//protected
// router.use(expressJwt({secret: process.env.SECRET}).unless({ path: [ '/login', '/register' ] }));

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
      client.query('INSERT INTO users(username, password, online, token) VALUES($1, $2, $3, $4) returning id', [req.body.user.username, hash, null, null], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        var token = jwt.sign({
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


//-----------USERS--------
//get all
router.get('/api/users', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM users', function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//post user
router.post('/api/users', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      client.query('INSERT INTO users(username, password, online, token) VALUES($1, $2, $3, $4) returning id', [req.body.username, hash, false, null], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });
});
//get one
router.get('/api/users/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM users WHERE id = $1', [req.params.id], function(err, result) {
      done();
      console.log(req.params.id)
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
// update one
router.put('/api/users/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    //query for password (storedPW)
    //compare with .compareSync(req.body.password, storedPW)
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      client.query('UPDATE users SET username = $2, password = $3, online = $4, token = $5  WHERE id = $1', [req.params.id, req.body.username, hash, req.body.online, req.body.token], function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });
});
//delete one
router.delete('/api/users/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
     console.log(conString)
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('DELETE FROM users WHERE id = $1',[req.params.id], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});

//------GAMES-------
//get all
router.get('/api/games', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM games', function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//post user
router.post('/api/games', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      client.query('INSERT INTO games(moves, result) VALUES($1, $2) returning id', [null, null], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });
});
//get one
router.get('/api/games/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM games WHERE id = $1', [req.params.id], function(err, result) {
      done();
      console.log(req.params.id)
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
// update one
router.put('/api/games/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    //query for password (storedPW)
    //compare with .compareSync(req.body.password, storedPW)
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      client.query('UPDATE games SET moves = $2, result = $3  WHERE id = $1', [req.params.id, req.body.moves, req.body.result], function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });
});
//delete one
router.delete('/api/games/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
     console.log(conString)
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('DELETE FROM games WHERE id = $1',[req.params.id], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});


//----------MATCHES-----------
//get one
router.get('/api/matches', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM matches', function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
//post user
router.post('/api/matches', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      client.query('INSERT INTO matches(w_user_id, b_user_id, game_id) VALUES($1, $2, $3) returning id', [req.body.w_user_id, req.body.b_user_id, req.body.game_id], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });
});
//get one
router.get('/api/matches/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('SELECT * FROM matches WHERE id = $1', [req.params.id], function(err, result) {
      done();
      console.log(req.params.id)
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});
// update one
router.put('/api/matches/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    //query for password (storedPW)
    //compare with .compareSync(req.body.password, storedPW)
    bcrypt.hash(req.body.password, 8, function(err, hash) {
      client.query('UPDATE matches SET w_user_id = $2, b_user_id = $3, game_id = $4  WHERE id = $1', [req.params.id, req.body.w_user_id, req.body.b_user_id, req.body.game_id], function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        res.send(result);
      });
    });
  });
});
//delete one
router.delete('/api/matches/:id', function(req, res, next) {
  pg.connect(conString, function(err, client, done) {
     console.log(conString)
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log("connected to database");
    client.query('DELETE FROM matches WHERE id = $1',[req.params.id], function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});

router.get('*', function(req, res, next) {
  res.sendFile('index.html', {
      root : __dirname + '/../public/'
  })
});

module.exports = router;
