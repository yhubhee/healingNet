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
--     doc_name VARCHAR(50),
--     doc_img VARCHAR(100)
--     specialty VARCHAR(150),
--     email VARCHAR(150),
--     phone VARCHAR(50),
--     gender VARCHAR(30),
--     password VARCHAR(250),
--     date_joined DATE,
--     address VARCHAR(200),
--     status VARCHAR(30),
--     about_doctor text (500),
--     admin_id INT,
--     FOREIGN KEY (admin_id) REFERENCES admin (admin_id),
-- );

-- CREATE TABLE token_blacklist (
--     token VARCHAR(255),
--     expires_at DATETIME
-- );

-- CREATE TABLE appointment (
--     appointment_id INT PRIMARY KEY AUTO_INCREMENT,
--     specialty VARCHAR(90),
--     doctor VARCHAR(90),
--     fullname VARCHAR(50),
--     appointmentDate DATE,
--     appointmentTime TIME,
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
-- );
-- CREATE TABLE prescription (
--     prescription_id INT PRIMARY KEY AUTO_INCREMENT,
--     drugs VARCHAR(90),
--     dosage VARCHAR(90),
--     note VARCHAR(50),
--     patient_id INT,
--     doctor_id INT,
--     FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
--     FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id)
-- );


-- create table doctor_schedules(
-- schedule_id int primary key auto_increment,
-- doctor_id int,
-- email varchar(200),
-- status varchar(50),
-- appointmentTime varchar(250),
-- appointmenTDate date
--     FOREIGN KEY (doctor_id) REFERENCES appointment(doctor_id),
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














-