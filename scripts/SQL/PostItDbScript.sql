DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_Name varchar NOT NULL,
  last_Name varchar NOT NULL,
  birthday date NOT NUll,
  email varchar NOT NULL,
  street varchar NOT NULL,
  number_adr varchar NOT NULL,
  postalCode varchar NOT NULL,
  city varchar NOT NULL,
  country varchar NOT NULL,
  picture varchar NOT NULL,
  bio varchar NULL,
  sex varchar NULL,
  userRole varchar NOT NULL
);

INSERT INTO users(first_Name, last_Name,birthday, email, street, number_adr, postalCode, city, country, picture, bio, sex, userRole)
 VALUES ('Sebastien', 'Lannoy', '1998-07-02', 'sebastien.lannoy@gmail.com','rue des pré', '253','5030','Gembloux','Belgique', 'gjgjgjg', 'Je suis jeune et efficace','Homme','admin');

 INSERT INTO users(first_Name, last_Name,birthday, email, street, number_adr, postalCode, city, country, picture, bio, sex, userRole)
 VALUES ('Michel', 'Cestle', '1995-02-01','michelCelst@gmail.com','rue du velux','271','2000','rio','Bresil','nanan.jpg','yo','M','user');

DROP TABLE IF EXISTS ConnexionInfo CASCADE;
CREATE TABLE ConnexionInfo(
  pseudo varchar PRIMARY KEY,
  passwordUser varchar NOT NULL,
  userId integer REFERENCES users(Id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE
);

INSERT INTO ConnexionInfo(pseudo, passwordUser, userId)VALUES ('god', '$2b$10$5SFcR/jHV9yXrrpS.ufRPuuH5SOAijq9OboFDQAdKOB8a.qnjHQge',1);
Insert INTO ConnexionInfo(pseudo, passwordUser, userId)VALUES ('Test','$2b$10$wM4xsUN2uCByI3ZW2E0ss.sGm/qs7QoM2e8MQCBjfyJJjPrHxiIo.',2);

DROP TABLE IF EXISTS adress CASCADE;
CREATE TABLE adress (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  street varchar NOT NULL,
  number_adr varchar NOT NULL,
  postalCode varchar NOT NULL,
  city varchar NOT NULL,
  country varchar NOT NULL
);

INSERT INTO adress (street, number_adr, postalCode, city, country) VALUES ('rue des pré', '253','5030','Gembloux','Belgique');

DROP TABLE IF EXISTS annonce CASCADE;
CREATE TABLE annonce (
  Id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY ,
  Title varchar NOT NULL,
  Content varchar  NOT NULL,
  price Real DEFAULT NULL,
  Date_Start date NOT NULL,
  is_Done bit NOT NULL,
  UserId integer REFERENCES users(Id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
  AdressID integer REFERENCES adress(Id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE
);

INSERT INTO annonce(Title, content, price, Date_Start, is_Done, UserId, AdressID) Values 
('Vente de Pelle', 'Vends pelle pour creuser des trous', 10.5, '2020-05-04', '0', 1, 1);

DROP TABLE IF EXISTS Category CASCADE;
CREATE TABLE category (
  wording varchar PRIMARY KEY,
  descriptionCategory varchar NULL
);

INSERT INTO category(wording, descriptionCategory) VALUES ('Vente', 'mise en vente objet');

DROP TABLE IF EXISTS AnnonceCategory CASCADE;
CREATE TABLE AnnonceCategory(
  annonceId integer REFERENCES annonce(Id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
  categoryWording varchar REFERENCES category(wording)ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE 
);

INSERT INTO AnnonceCategory (annonceId,categoryWording) Values(1,'Vente');

DROP TABLE IF EXISTS Review CASCADE;
CREATE TABLE Review(
   Id integer GENERATED ALWAYS AS IDENTITY ,
   userId_Receiver integer REFERENCES users(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
   note varchar NOT NULL,
   descriptionReview varchar NOT NULL,
   userId_Sender integer REFERENCES users(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
   PRIMARY KEY(ID, UserId_Receiver)
);

INSERT INTO Review(userId_Receiver, note, descriptionReview, userId_Sender) 
Values (1,'*****','he is a good guys',2);

DROP TABLE IF EXISTS Messages CASCADE;
CREATE TABLE Messages(
  id integer GENERATED ALWAYS AS IDENTITY,
  userId_Receiver integer REFERENCES users(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
  content varchar null,
  userId_Sender integer REFERENCES users(id) ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE,
  PRIMARY KEY (id, userId_Receiver) 
);

INSERT INTO Messages(userId_Receiver, content,userId_Sender) 
VALUES (2,'Bienvenue a Putalundi',1);