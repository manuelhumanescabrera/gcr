CREATE TABLE usuarios(
  name varchar(50) NOT NULL,
  surname varchar(50) NOT NULL,
  email varchar(250) NOT NULL,
  password varchar(250) NOT NULL,
  role varchar(25) NOT NULL,
  image varchar(250),
  primary key(email)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;
