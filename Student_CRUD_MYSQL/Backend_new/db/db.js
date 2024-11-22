const mysql = require("mysql")


const connectDB = () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_db'
  })

  connection.connect((err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected to db ');
  })

  return connection
}

const db = connectDB()

const Create_user = `CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  user_type ENUM('teacher', 'student') NOT NULL
)`

const Create_student = `CREATE TABLE IF NOT EXISTS students(
  student_id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(100) NOT NULL,
  student_email VARCHAR(200),
  student_profilePic VARCHAR(400)
)`;

const Create_class = `CREATE TABLE IF NOT EXISTS classes(
  class_id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(100) NOT NULL,
  teacher_id INT NOT NULL,
  FOREIGN KEY(teacher_id) REFERENCES users(user_id)
)`;

const Create_class_student = `CREATE TABLE IF NOT EXISTS class_students(
  class_id INT,
  student_id INT,
  FOREIGN KEY(class_id) REFERENCES classes(class_id),
  FOREIGN KEY(student_id) REFERENCES students(student_id),
  PRIMARY KEY(class_id, student_id)
)`;

const Create_student_marks = `CREATE TABLE IF NOT EXISTS student_marks(
  mark_id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT,
  student_id INT,
  mark DECIMAL(5, 2),
  FOREIGN KEY(class_id) REFERENCES classes(class_id),
  FOREIGN KEY(student_id) REFERENCES students(student_id),
  UNIQUE(class_id, student_id)
)`;


db.query(Create_user, (err, result) => {
  if (err) {
    console.log("Create_user", err);
  }
  console.log('Create_user table created');
});


db.query(Create_student, (err, result) => {
  if (err) {
    console.log("Create_student", err);
  }
  console.log('Create_student table created');
});


db.query(Create_class, (err, result) => {
  if (err) {
    throw err;
  }
  console.log('Create_class table created');
});


db.query(Create_class_student, (err, result) => {
  if (err) {
    throw err;
  }
  console.log('Create_class_student table created');
});


db.query(Create_student_marks, (err, result) => {
  if (err) {
    throw err;
  }
  console.log('Create_student_marks table created');
});





module.exports = connectDB