import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Neon DB connection
const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// ✅ test endpoint
app.get("/", (req, res) => {
  res.send("Kiropay Backend Running 🚀");
});

// 🧍‍♂️ Get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Add balance
app.post("/api/add", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [
      amount,
      userId,
    ]);
    res.json({ message: "Balance added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➖ Remove balance
app.post("/api/remove", async (req, res) => {
  const { userId, amount } = req.body;
  try {
    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [
      amount,
      userId,
    ]);
    res.json({ message: "Balance removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ Create user
app.post("/api/create", async (req, res) => {
  const { name, balance } = req.body;
  try {
    await pool.query("INSERT INTO users (name, balance) VALUES ($1, $2)", [
      name,
      balance,
    ]);
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete user
app.delete("/api/delete/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));