var express = require('express');
var router = express.Router();

//pg config
var pg = require('pg');
var conString = 'postgres://@localhost/chess_db';

//bcrypt
var bcrypt = require('bcrypt');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

// router.get('*', function(req, res, next) {
//   res.sendFile('index.html', {
//       root : __dirname + '/../public/'
//   })
// });

module.exports = router;
