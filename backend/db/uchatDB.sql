DROP DATABASE IF EXISTS uchat;
CREATE DATABASE uchat;

\c uchat;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  password_digest VARCHAR,
  email VARCHAR,
  full_name VARCHAR,
  profile_pic VARCHAR DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
);


CREATE TABLE contacts (
    user_ID INTEGER REFERENCES users,
    contact_ID  INTEGER REFERENCES users
);

CREATE TABLE threads (
    ID SERIAL PRIMARY KEY,
    user_one INTEGER REFERENCES users,
    user_two INTEGER REFERENCES users
);

CREATE TABLE messages (
    ID SERIAL PRIMARY KEY,
    thread_ID INTEGER REFERENCES threads,
    sender VARCHAR,
    receiver VARCHAR,
    body VARCHAR,
    date_sent VARCHAR,
    isread BOOLEAN
);


INSERT INTO users (ID, username, password_digest, email, full_name, profile_pic)
VALUES 
('1','Kelstar809','$2a$10$brAZfSmByFeZmPZ/MH5zne9YDhugjW9CtsBGgXqGfix0g1tcooZWq', 'kelstar809@instant.five', 'Kel Star', 'https://media.licdn.com/media/AAIAAgDGAAAAAQAAAAAAAAtfAAAAJDMyYjYwYzg3LWRmNjMtNGM3Mi05ODIwLTUxYzc3NzQxYmJkMw.jpg'),
('2','lala809','$2a$10$brAZfSmByFeZmPZ/MH5zne9YDhugjW9CtsBGgXqGfix0g1tcooZWq', 'lala809@instant.five', 'Lala Land', ''),
('3','eioncont','$2a$10$LUQarA3IuQ4drG7dR16tDOsq9.SKIo9uCO9NwjH4Az4z0SruD1Zp6', '', '', ''),
('4','lev','$2a$10$fVXWijQhWpeF/Nm/3FCYb.MPz107f8MWlHbLrlPxyAKDYuse5iS4q', '', '', 'https://media.licdn.com/media/p/7/000/223/104/1ee2e97.jpg'),
('5','Zero','$2a$10$JFKsUWVbw3zj4XGq8KLL.OPLoX9qk3OH876EJzaXPi7ZaXSU6UG8S', 'emperor@in.five', 'Lelouch Vi Brittania', 'http://i.imgur.com/EPn8Zas.png'),
('6','Aang','$2a$10$9W5WEmwEPAfzSMqVgu/agOMHrvFfo7L2uufLz8NN34fy1KdgDO0Ai', 'avatar@in.five', 'Aang of Air Nomads', 'https://vignette.wikia.nocookie.net/dragonball/images/c/cc/Adult-aang-aang-31587811-290-290.jpg/revision/latest?cb=20130313023637');


INSERT INTO contacts (user_ID, contact_ID)
VALUES
('1', '2'),
('1','3'),
('3','1'),
('2','3'),
('4','1');

INSERT INTO  threads (user_one,user_two)
VALUES
('1','2'),
('2','3'),
('3','1'),
('4','1');

-- INSERT INTO messages (thread_ID,sender,receiver,body,date_sent,isread)