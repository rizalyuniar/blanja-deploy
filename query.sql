CREATE DATABASE membuat_api;

CREATE TABLE categorys(
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE products(
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    price INT NOT NULL,
    color VARCHAR NOT NULL,
    size VARCHAR NOT NULL,
    stock INT NOT NULL,
    rating VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    photo VARCHAR NOT NULL,
    id_category VARCHAR REFERENCES categorys ON DELETE CASCADE,
    foreign key (id_category) REFERENCES categorys(id)
);

CREATE TABLE customers(
    id VARCHAR PRIMARY KEY,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    fullname VARCHAR NOT NULL,
    phone INT NOT NULL,
    tgl_lahir DATE NOT NULL,
    role VARCHAR NOT NULL
);

CREATE TABLE users(
    id VARCHAR PRIMARY key,
    email varchar NOT NULL,
    password VARCHAR NOT NULL,
    fullname VARCHAR NOT NULL,
    role VARCHAR NOT NULL
);
insert into users(id,email,password,fullname,role)
values('1a','rizalyuniar123@gmail.com','123456','R.Rizal Yuniar.S','admin'),
('2b','nyoba@gmail.com','123456','nyoba','user');

insert into customers(id,name,phone,tgl_lahir,email,pw) 
values(1,'rizal',08123,'1997-06-30','rizalyuniar123@gmail.com','rahasia123');


-- create
insert into products(id,name,price,color,size,stock,rating,photo,description) 
values(1,'baju muslim pria',60000,'white','m',4,'sangat bagus','foto1','ini adalah baju muslim pria'),
(2,'baju batik pria',100000,'black','l',7,'bagus','foto2','ini adalah baju batik pria');

insert into categorys(id,name) values(1,'baju');

-- get detail by id
select * from products where id=1;
-- update
update products
set price=70000,
stock=7
where id=1;
-- delete
delete from products where id=4;