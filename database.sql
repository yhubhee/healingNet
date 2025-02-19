-- DROP DATABASE IF EXISTS hospital_new; -- If exited
create database hospital_new; -- Your database name
-- use hospital_old;

-- CREATE TABLE patients (
--     patient_id INT PRIMARY KEY AUTO_INCREMENT,
--     firstname VARCHAR(50),
--     lastname VARCHAR(50),
--     phone VARCHAR(50),
--     email VARCHAR(150),
--     date_joined DATE,
--     date_of_birth DATE,
--     gender VARCHAR(30),
--     password VARCHAR(250),
--     address VARCHAR(200),
--     status VARCHAR(30)
-- );

-- CREATE TABLE doctors (
--     doctor_id INT PRIMARY KEY AUTO_INCREMENT,
--     firstname VARCHAR(50),
--     lastname VARCHAR(50),
--     department VARCHAR(150),
--     specialty VARCHAR(150),
--     date_of_birth DATE,
--     email VARCHAR(150),
--     phone VARCHAR(50),
--     gender VARCHAR(30),
--     password VARCHAR(250),
--     date_joined DATE,
--     address VARCHAR(200),
--     status VARCHAR(30)
--     Homeappointmentstatus VARCHAR (30)
-- );

-- CREATE TABLE appointment (
--     appointment_id INT PRIMARY KEY AUTO_INCREMENT,
--     department VARCHAR(255),
--     specialty VARCHAR(90),
--     doctor VARCHAR(90),
--     fullname VARCHAR(50),
--     email VARCHAR(200),
--     illness VARCHAR(200),
--     appointment_date DATE,
--     appointment_time TIME,
--     patient_id INT,
--     doctor_id INT,
--     status VARCHAR(50),
--     FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
--     FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
-- );

-- create table admins(
-- admin_id int primary key auto_increment,
-- firstname varchar (100),
-- lastname varchar(100),
-- email varchar(100),
-- password varchar(200),
-- status varchar (50),
-- gender varchar(30)
-- );


-- create table doctor_schedules(
-- schedule_id int primary key auto_increment,
-- doctor_id int,
-- email varchar(200),
-- status varchar(50),
-- illness varchar(250),
-- appointment_time varchar(250),
-- appointment_date date
    FOREIGN KEY (patient_id) REFERENCES appointment(patient_id),
-- );

-- create table homeappointment(
-- appointment_id int primary key auto_increment,
-- fullname varchar(200) ,
-- email varchar(150) ,
-- phone varchar(50) ,
-- Emergency_type varchar(100) ,
-- date date ,
-- time varchar(30) ,
-- emergency_message varchar(255)
-- );

-- alter table doctor_schedules
-- illness varchar(250),
-- appointment_time varchar(250),
-- appointment_date date



-- create table comments(
-- comment_id int primary key auto_increment,
-- comment varchar (250),
-- email varchar(100)

-- );
-- alter table comments
-- auto_increment = 1000;

-- create table messages(
-- message_id int primary key auto_increment,
-- fullname varchar (250),
-- email varchar(100),
-- phone varchar(50),
-- message varchar(255)
-- );

-- alter table messages
-- auto_increment = 1000;


-- create table characters(
-- character_id int primary key auto_increment,
-- Admin_email varchar(150),
-- characters varchar(100),
-- status varchar (50)
-- );

-- alter table characters
-- rename column character_id to voucher_id;














-- const patienttable = `
--     CREATE TABLE IF NOT EXISTS patients (
--         patient_id SERIAL PRIMARY KEY,
--         firstname VARCHAR(50),
--         lastname VARCHAR(50),
--         phone VARCHAR(50),
--         email VARCHAR(150),
--         date_of_birth DATE,
--         gender VARCHAR(30),
--         password VARCHAR(250),
--         address VARCHAR(200),
--         status VARCHAR(30)
--     );
-- `;
-- db.query(patienttable,(err, result)=>{
--     if(!err){
--         console.log(`Patient Table Created`);
        
--     }else{
--         console.log(err);
        
--     }
-- })

-- const doctortable = `create table doctors(
-- doctor_id SERIAL PRIMARY KEY,
-- firstname varchar (50),
-- lastname varchar(50),
-- specialty varchar (150),
-- date_of_birth date,
-- email varchar (150),
-- phone varchar(50),
-- gender varchar(30),
-- password varchar (250),
-- date_joined date,
-- address varchar(200),
-- status varchar(30)
-- );`

-- db.query(doctortable,(err, result)=>{
--     if(!err){
--         console.log(`Doctor Table Created`);
        
--     }else{
--         console.log(err);
        
--     }
-- })


-- const appointment = `
--     CREATE TABLE appointment (
--         appointment_id SERIAL PRIMARY KEY,
--         firstname VARCHAR(50),
--         email VARCHAR(200),
--         appointment_date DATE,
--         appointment_time TIME,
--         patient_id INT,
--         doctor_id INT,
--         status VARCHAR(50),
--         FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
--         FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
--     );
-- `;

-- db.query(appointment,(err, result)=>{
--     if(!err){
--         console.log(`Appointment Table Created`);
        
--     }else{
--         console.log(err);
        
--     }
-- })


-- const admins = `CREATE TABLE admins (
--     admin_id SERIAL PRIMARY KEY,  -- SERIAL auto-increments the admin_id
--     firstname VARCHAR(100),
--     lastname VARCHAR(100),
--     email VARCHAR(100),
--     password VARCHAR(200),
--     status VARCHAR(50),
--     gender VARCHAR(30)
-- );`
-- db.query(admins,(err, result)=>{
--     if(!err){
--         console.log(`Appointment Table Created`);
        
--     }else{
--         console.log(err);
        
--     }
-- })

--  const doctorschedule = `
--      create table doctor_schedules(
--  schedule_id int primary key auto_increment,
--  doctor_id int,
--  email varchar(200),
--  status varchar(50),
--  note varchar(250),
--  appointment_type varchar(250),
--  schedule_date datetime
--  );

--  alter table doctor_schedules
--  auto_increment = 1001;
--  `;




--  db.query(doctorschedule,(err, result)=>{
--      if(!err){
--          console.log(`schedule Table Created`);
        
--      }else{
--          console.log(err);
        
--      }
--  })


--  const comments = `create table comments(
--  comment_id int primary key auto_increment,
--  comment varchar (250),
--  email varchar(100)

--  );
--  alter table comments
--  auto_increment = 1000;`


--  db.query(comments,(err, result)=>{
--      if(!err){
--          console.log(`comment Table Created`);
        
--      }else{
--          console.log(err);
        
--      }
--  })

--  const message = `create table messages(
--  message_id int primary key auto_increment,
--  fullname varchar (250),
--  email varchar(100),
--  phone varchar(50),
--  message varchar(255)

--  );
--  alter table messages
--  auto_increment = 1000;`

--  db.query(message,(err, result)=>{
--      if(!err){
--          console.log(`message Table Created`);
        
--      }else{
--          console.log(err);
        
--      }
--  })