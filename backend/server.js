const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-lucky-lab-ab8h4mw3-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// إنشاء مستخدم جديد
app.post("/signup", upload.single("avatar"), async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const avatar = req.file ? req.file.filename : "default.jpg";
  try {
    const result = await pool.query(
      "INSERT INTO users (email,password,first_name,last_name,avatar,balance,role) VALUES ($1,$2,$3,$4,$5,100,'user') RETURNING *",
      [email, password, firstName, lastName, avatar]
    );
    res.json({ status: "success", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

// تسجيل دخول
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );
    if (result.rows.length === 0)
      return res.status(401).json({ status: "error", message: "Invalid credentials" });
    res.json({ status: "success", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

// جلب بيانات المستخدم
app.get("/wallet/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ status: "error", message: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

// Admin: تعديل الرصيد
app.post("/admin/balance", async (req, res) => {
  const { email, amount } = req.body;
  try {
    const result = await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE email=$2 RETURNING *",
      [amount, email]
    );
    res.json({ status: "success", user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

// Admin: حذف مستخدم
app.post("/admin/delete", async (req, res) => {
  const { email } = req.body;
  try {
    await pool.query("DELETE FROM users WHERE email=$1", [email]);
    res.json({ status: "success", message: "User deleted" });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));