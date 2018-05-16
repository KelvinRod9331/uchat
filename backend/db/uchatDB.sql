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
  country VARCHAR,
  profile_pic VARCHAR DEFAULT '/images/default-profile.png'
);


CREATE TABLE contacts (
    user_ID INTEGER REFERENCES users,
    contact_ID  INTEGER REFERENCES users
);

CREATE TABLE threads (
    ID SERIAL PRIMARY KEY,
    user_one INTEGER REFERENCES users,
    user_two INTEGER REFERENCES users,
    user_one_name VARCHAR,
    user_two_name VARCHAR
);

CREATE TABLE messages (
    ID SERIAL PRIMARY KEY,
    thread_ID INTEGER REFERENCES threads,
    sender_id INTEGER REFERENCES users,
    receiver_id INTEGER REFERENCES users,
    sender_message VARCHAR,
    receiver_message VARCHAR,
    date_sent VARCHAR,
    isread BOOLEAN
);

CREATE TABLE notifications (
    ID SERIAL PRIMARY KEY,
    receiver_ID INTEGER REFERENCES users,
    sender_id INTEGER REFERENCES users,
    type_notification VARCHAR,
    date_sent VARCHAR,
    read BOOLEAN DEFAULT false
)

CREATE TABLE languages (
    ID SERIAL PRIMARY KEY,
    abbreviation VARCHAR,
    name VARCHAR
);

  CREATE TABLE countries(
    ID SERIAL PRIMARY KEY,
    name VARCHAR,
    code VARCHAR
);


CREATE TABLE posts (
    ID SERIAL PRIMARY KEY,
    photo VARCHAR,
    comments VARCHAR,
    chat_story VARCHAR
);


INSERT INTO users (ID, username, password_digest, email, full_name, language, country)
VALUES 
('1','Kelstar809','$2a$10$7SjEsO0VqISPHt2ybQtyiebW0UOQSN/Z8aCsOk7rVt3ZpdFbxGGSK', 'kelstar809@instant.five', 'Kel Star', 'en', 'us'),
('2','lala809','$2a$10$7SjEsO0VqISPHt2ybQtyiebW0UOQSN/Z8aCsOk7rVt3ZpdFbxGGSK', 'lala809@instant.five', 'Lala Land','es', 'do'),
('3','eioncont','$2a$10$7SjEsO0VqISPHt2ybQtyiebW0UOQSN/Z8aCsOk7rVt3ZpdFbxGGSK', '', '', 'en', 'us'),
('4','lev','$2a$10$7SjEsO0VqISPHt2ybQtyiebW0UOQSN/Z8aCsOk7rVt3ZpdFbxGGSK', '', '', 'ru', 'ru'),
('5','Zero','$2a$10$JFKsUWVbw3zj4XGq8KLL.OPLoX9qk3OH876EJzaXPi7ZaXSU6UG8S', 'emperor@in.five', 'Lelouch Vi Brittania', 'fr', 'fr'),
('6','Aang','$2a$10$9W5WEmwEPAfzSMqVgu/agOMHrvFfo7L2uufLz8NN34fy1KdgDO0Ai', 'avatar@in.five', 'Aang of Air Nomads', 'es', 'ec');


INSERT INTO contacts (user_ID, contact_ID)
VALUES
('6','2'),
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


INSERT INTO countries (name, code)
VALUES 
('Afghanistan','AF'),
('Ã…land Islands','AX'),
('Albania','AL'),
('Algeria','DZ'),
('American Samoa','AS'),
('Andorra','AD'),
('Angola','AO'),
('Anguilla','AI'),
('Antarctica','AQ'),
('Antigua and Barbuda','AG'),
('Argentina','AR'),
('Armenia','AM'),
('Aruba','AW'),
('Australia','AU'),
('Austria','AT'),
('Azerbaijan','AZ'),
('Bahamas','BS'),
('Bahrain','BH'),
('Bangladesh','BD'),
('Barbados','BB'),
('Belarus','BY'),
('Belgium','BE'),
('Belize','BZ'),
('Benin','BJ'),
('Bermuda','BM'),
('Bhutan','BT'),
('Bolivia','BO'),
('Bonaire','BQ'),
('Bosnia and Herzegovina','BA'),
('Botswana','BW'),
('Bouvet Island','BV'),
('Brazil','BR'),
('British Indian Ocean Territory','IO'),
('Brunei Darussalam','BN'),
('Bulgaria','BG'),
('Burkina Faso','BF'),
('Burundi','BI'),
('Cambodia','KH'),
('Cameroon','CM'),
('Canada','CA'),
('Cape Verde','CV'),
('Cayman Islands','KY'),
('Central African Republic','CF'),
('Chad','TD'),
('Chile','CL'),
('China','CN'),
('Christmas Island','CX'),
('Cocos Islands','CC'),
('Colombia','CO'),
('Comoros','KM'),
('Congo','CG'),
('Congo','CD'),
('Cook Islands','CK'),
('Costa Rica','CR'),
('Croatia','HR'),
('Cuba','CU'),
('CuraÃ§ao','CW'),
('Cyprus','CY'),
('Czech Republic','CZ'),
('Denmark','DK'),
('Djibouti','DJ'),
('Dominica','DM'),
('Dominican Republic','DO'),
('Ecuador','EC'),
('Egypt','EG'),
('El Salvador','SV'),
('Equatorial Guinea','GQ'),
('Eritrea','ER'),
('Estonia','EE'),
('Ethiopia','ET'),
('Falkland Islands (Malvinas)','FK'),
('Faroe Islands','FO'),
('Fiji','FJ'),
('Finland','FI'),
('France','FR'),
('French Guiana','GF'),
('French Polynesia','PF'),
('Gabon','GA'),
('Gambia','GM'),
('Georgia','GE'),
('Germany','DE'),
('Ghana','GH'),
('Gibraltar','GI'),
('Greece','GR'),
('Greenland','GL'),
('Grenada','GD'),
('Guadeloupe','GP'),
('Guam','GU'),
('Guatemala','GT'),
('Guernsey','GG'),
('Guinea','GN'),
('Guinea-Bissau','GW'),
('Guyana','GY'),
('Haiti','HT'),
('Honduras','HN'),
('Hong Kong','HK'),
('Hungary','HU'),
('Iceland','IS'),
('India','IN'),
('Indonesia','ID'),
('Iran','IR'),
('Iraq','IQ'),
('Ireland','IE'),
('Isle of Man','IM'),
('Israel','IL'),
('Italy','IT'),
('Jamaica','JM'),
('Japan','JP'),
('Jersey','JE'),
('Jordan','JO'),
('Kazakhstan','KZ'),
('Kenya','KE'),
('Kiribati','KI'),
('Korea','KP'),
('Kuwait','KW'),
('Kyrgyzstan','KG'),
('Latvia','LV'),
('Lebanon','LB'),
('Lesotho','LS'),
('Liberia','LR'),
('Libya','LY'),
('Liechtenstein','LI'),
('Lithuania','LT'),
('Luxembourg','LU'),
('Macao','MO'),
('Macedonia','MK'),
('Madagascar','MG'),
('Malawi','MW'),
('Malaysia','MY'),
('Maldives','MV'),
('Mali','ML'),
('Malta','MT'),
('Marshall Islands','MH'),
('Martinique','MQ'),
('Mauritania','MR'),
('Mauritius','MU'),
('Mayotte','YT'),
('Mexico','MX'),
('Monaco','MC'),
('Mongolia','MN'),
('Montenegro','ME'),
('Montserrat','MS'),
('Morocco','MA'),
('Mozambique','MZ'),
('Myanmar','MM'),
('Namibia','NA'),
('Nauru','NR'),
('Nepal','NP'),
('Netherlands','NL'),
('New Caledonia','NC'),
('New Zealand','NZ'),
('Nicaragua','NI'),
('Niger','NE'),
('Nigeria','NG'),
('Niue','NU'),
('Norfolk Island','NF'),
('Northern Mariana Islands','MP'),
('Norway','NO'),
('Oman','OM'),
('Pakistan','PK'),
('Palau','PW'),
('Palestine','PS'),
('Panama','PA'),
('Papua New Guinea','PG'),
('Paraguay','PY'),
('Peru','PE'),
('Philippines','PH'),
('Pitcairn','PN'),
('Poland','PL'),
('Portugal','PT'),
('Puerto Rico','PR'),
('Qatar','QA'),
('RÃ©union','RE'),
('Romania','RO'),
('Russian Federation','RU'),
('Rwanda','RW'),
('Saint BarthÃ©lemy','BL'),
('Saint Kitts and Nevis','KN'),
('Saint Lucia','LC'),
('Saint Martin','MF'),
('Saint Pierre and Miquelon','PM'),
('Saint Vincent and the Grenadines','VC'),
('Samoa','WS'),
('San Marino','SM'),
('Sao Tome and Principe','ST'),
('Saudi Arabia','SA'),
('Senegal','SN'),
('Serbia','RS'),
('Seychelles','SC'),
('Sierra Leone','SL'),
('Singapore','SG'),
('Slovakia','SK'),
('Slovenia','SI'),
('Solomon Islands','SB'),
('Somalia','SO'),
('South Africa','ZA'),
('South Georgia and the South Sandwich Islands','GS'),
('South Sudan','SS'),
('Spain','ES'),
('Sri Lanka','LK'),
('Sudan','SD'),
('Suriname','SR'),
('Svalbard and Jan Mayen','SJ'),
('Swaziland','SZ'),
('Sweden','SE'),
('Switzerland','CH'),
('Syrian Arab Republic','SY'),
('Taiwan','TW'),
('Tajikistan','TJ'),
('Tanzania','TZ'),
('Thailand','TH'),
('Timor-Leste','TL'),
('Togo','TG'),
('Tokelau','TK'),
('Tonga','TO'),
('Trinidad and Tobago','TT'),
('Tunisia','TN'),
('Turkey','TR'),
('Turkmenistan','TM'),
('Turks and Caicos Islands','TC'),
('Tuvalu','TV'),
('Uganda','UG'),
('Ukraine','UA'),
('United Arab Emirates','AE'),
('United Kingdom','GB'),
('United States','US'),
('United States Minor Outlying Islands','UM'),
('Uruguay','UY'),
('Uzbekistan','UZ'),
('Vanuatu','VU'),
('Venezuela','VE'),
('Viet Nam','VN'),
('Virgin Islands - US','VI'),
('Wallis and Futuna','WF'),
('Western Sahara','EH'),
('Yemen','YE'),
('Zambia','ZM'),
('Zimbabwe','ZW');