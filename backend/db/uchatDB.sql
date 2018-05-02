DROP DATABASE IF EXISTS uchat;
CREATE DATABASE uchat;

\c uchat;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  username VARCHAR,
  password_digest VARCHAR,
  email VARCHAR,
  full_name VARCHAR,
  language VARCHAR,
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
    sender_id INTEGER REFERENCES users,
    receiver_id INTEGER REFERENCES users,
    sender_body VARCHAR,
    receiver_body VARCHAR,
    date_sent VARCHAR,
    isread BOOLEAN
);

CREATE TABLE languages (
    ID SERIAL PRIMARY KEY,
    abbreviation VARCHAR,
    name VARCHAR
);

CREATE TABLE posts (
    ID SERIAL PRIMARY KEY,
    photo VARCHAR,
    comments VARCHAR,
    chat_story VARCHAR
);


INSERT INTO users (ID, username, password_digest, email, full_name, language, profile_pic)
VALUES 
('1','Kelstar809','$2a$10$brAZfSmByFeZmPZ/MH5zne9YDhugjW9CtsBGgXqGfix0g1tcooZWq', 'kelstar809@instant.five', 'Kel Star', 'en', 'https://media.licdn.com/media/AAIAAgDGAAAAAQAAAAAAAAtfAAAAJDMyYjYwYzg3LWRmNjMtNGM3Mi05ODIwLTUxYzc3NzQxYmJkMw.jpg'),
('2','lala809','$2a$10$brAZfSmByFeZmPZ/MH5zne9YDhugjW9CtsBGgXqGfix0g1tcooZWq', 'lala809@instant.five', 'Lala Land','es', ''),
('3','eioncont','$2a$10$LUQarA3IuQ4drG7dR16tDOsq9.SKIo9uCO9NwjH4Az4z0SruD1Zp6', '', '', 'en', ''),
('4','lev','$2a$10$fVXWijQhWpeF/Nm/3FCYb.MPz107f8MWlHbLrlPxyAKDYuse5iS4q', '', '', 'ru', 'https://media.licdn.com/media/p/7/000/223/104/1ee2e97.jpg'),
('5','Zero','$2a$10$JFKsUWVbw3zj4XGq8KLL.OPLoX9qk3OH876EJzaXPi7ZaXSU6UG8S', 'emperor@in.five', 'Lelouch Vi Brittania', 'fr', 'http://i.imgur.com/EPn8Zas.png'),
('6','Aang','$2a$10$9W5WEmwEPAfzSMqVgu/agOMHrvFfo7L2uufLz8NN34fy1KdgDO0Ai', 'avatar@in.five', 'Aang of Air Nomads', 'es', 'https://vignette.wikia.nocookie.net/dragonball/images/c/cc/Adult-aang-aang-31587811-290-290.jpg/revision/latest?cb=20130313023637');


INSERT INTO contacts (user_ID, contact_ID)
VALUES
('6', '2'),
('6','5'),
('6','1'),
('6','4'),
('6','3');


INSERT INTO languages(abbreviation, name)
VALUES
    ('af', 'Afrikaans'),
    ('sq', 'Albanian'),
    ('am', 'Amharic'),
    ('ar', 'Arabic'),
    ('hy', 'Armenian'),
    ('az', 'Azerbaijani'),
    ('eu', 'Basque'),
    ('be', 'Belarusian'),
    ('bn', 'Bengali'),
    ('bs', 'Bosnian'),
    ('bg', 'Bulgarian'),
    ('ca', 'Catalan'),
    ('ceb', 'Cebuano'),
    ('ny', 'Chichewa'),
    ('zh-cn', 'Chinese Simplified'),
    ('zh-tw', 'Chinese Traditional'),
    ('co', 'Corsican'),
    ('hr', 'Croatian'),
    ('cs', 'Czech'),
    ('da', 'Danish'),
    ('nl', 'Dutch'),
    ('en', 'English'),
    ('eo', 'Esperanto'),
    ('et', 'Estonian'),
    ('tl', 'Filipino'),
    ('fi', 'Finnish'),
    ('fr', 'French'),
    ('fy', 'Frisian'),
    ('gl', 'Galician'),
    ('ka', 'Georgian'),
    ('de', 'German'),
    ('el', 'Greek'),
    ('gu', 'Gujarati'),
    ('ht', 'Haitian Creole'),
    ('ha', 'Hausa'),
    ('haw', 'Hawaiian'),
    ('iw', 'Hebrew'),
    ('hi', 'Hindi'),
    ('hmn', 'Hmong'),
    ('hu', 'Hungarian'),
    ('is', 'Icelandic'),
    ('ig', 'Igbo'),
    ('id', 'Indonesian'),
    ('ga', 'Irish'),
    ('it', 'Italian'),
    ('ja', 'Japanese'),
    ('jw', 'Javanese'),
    ('kn', 'Kannada'),
    ('kk', 'Kazakh'),
    ('km', 'Khmer'),
    ('ko', 'Korean'),
    ('ku', 'Kurdish (Kurmanji)'),
    ('ky', 'Kyrgyz'),
    ('lo', 'Lao'),
    ('la', 'Latin'),
    ('lv', 'Latvian'),
    ('lt', 'Lithuanian'),
    ('lb', 'Luxembourgish'),
    ('mk', 'Macedonian'),
    ('mg', 'Malagasy'),
    ('ms', 'Malay'),
    ('ml', 'Malayalam'),
    ('mt', 'Maltese'),
    ('mi', 'Maori'),
    ('mr', 'Marathi'),
    ('mn', 'Mongolian'),
    ('my', 'Myanmar (Burmese)'),
    ('ne', 'Nepali'),
    ('no', 'Norwegian'),
    ('ps', 'Pashto'),
    ('fa', 'Persian'),
    ('pl', 'Polish'),
    ('pt', 'Portuguese'),
    ('ma', 'Punjabi'),
    ('ro', 'Romanian'),
    ('ru', 'Russian'),
    ('sm', 'Samoan'),
    ('gd', 'Scots Gaelic'),
    ('sr', 'Serbian'),
    ('st', 'Sesotho'),
    ('sn', 'Shona'),
    ('sd', 'Sindhi'),
    ('si', 'Sinhala'),
    ('sk', 'Slovak'),
    ('sl', 'Slovenian'),
    ('so', 'Somali'),
    ('es', 'Spanish'),
    ('su', 'Sundanese'),
    ('sw', 'Swahili'),
    ('sv', 'Swedish'),
    ('tg', 'Tajik'),
    ('ta', 'Tamil'),
    ('te', 'Telugu'),
    ('th', 'Thai'),
    ('tr', 'Turkish'),
    ('uk', 'Ukrainian'),
    ('ur', 'Urdu'),
    ('uz', 'Uzbek'),
    ('vi', 'Vietnamese'),
    ('cy', 'Welsh'),
    ('xh', 'Xhosa'),
    ('yi', 'Yiddish'),
    ('yo', 'Yoruba'),
    ('zu', 'Zulu');