import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "job_tracker_user",
  password: "mypassword123",
  database: "job_tracker",
});
