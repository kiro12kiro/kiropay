import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

// ✅ test endpoint
app.get("/", (req, res) => {
  res.send("Kiropay Backend Running 🚀");
});

// 🧍‍♂️ Get all users (admin only)
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Create user
app.post("/api/users/create", async (req, res) => {
  const { name, family, email, password } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (name, family, email, password, balance, isAdmin) VALUES ($1, $2, $3, $4, 0, false) ON CONFLICT (email) DO NOTHING",
      [name, family, email, password]
    );
    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Login
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ message: "Login successful", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add balance (admin)
app.post("/api/users/add", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, userId]);
    res.json({ message: "Balance added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➖ Remove balance (admin)
app.post("/api/users/remove", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [amount, userId]);
    res.json({ message: "Balance removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete user (admin)
app.delete("/api/users/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));