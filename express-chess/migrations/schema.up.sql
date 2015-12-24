CREATE TABLE users (
  id serial primary key,
  username varchar(60),
  password varchar(60),
  online boolean,
  token varchar(200)
);

CREATE TABLE games (
  id serial primary key,
  moves varchar(600),
  result varchar(60)
);

CREATE TABLE matches (
  id serial primary key,
  w_user_id integer references users(id) on delete cascade,
  b_user_id integer references users(id) on delete cascade,
  game_id integer references games(id) on delete cascade
);