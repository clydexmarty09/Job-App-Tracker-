import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "myuser",
  password: "mypassword",
  database: "job_tracker",
});
