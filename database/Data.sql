CREATE DATABASE project;
USE project;
CREATE TABLE users(
user_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50),
email VARCHAR(100) UNIQUE,
password VARCHAR(100)
);

// use above part only for tomorrow minproject code
  





// dont refer this till now

CREATE TABLE timetables(
table_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
timetable_text TEXT,
upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE attendance(
attendance_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
lecture_name VARCHAR(100),
lecture_date DATE,
start_time TIME,
end_time TIME,
status ENUM('present','absent','not_marked')DEFAULT 'not_marked',
FOREIGN KEY(USER_ID) REFERENCES users(user_id)
);

CREATE TABLE attendance_summary(
summary_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
total_lecture INT DEFAULT 0,
attended_lecture INT DEFAULT 0,
attendance_percentage FLOAT DEFAULT 0,
last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY(USER_ID) REFERENCES users(user_id)
);
