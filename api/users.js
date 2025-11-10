import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("Kiropay Backend Running 🚀");
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create user
app.post("/api/create", async (req, res) => {
  const { name, family_name, email, balance, isAdmin } = req.body;
  try {
    await pool.query(
      "INSERT INTO users (name, family_name, email, balance, is_admin) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING",
      [name, family_name, email, balance, isAdmin || false]
    );
    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add balance (admin only)
app.post("/api/add", async (req, res) => {
  const { userId, amount, adminEmail } = req.body;
  try {
    const checkAdmin = await pool.query("SELECT is_admin FROM users WHERE email=$1", [adminEmail]);
    if (!checkAdmin.rows[0]?.is_admin) return res.status(403).json({ error: "Only admin can add balance" });

    await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, userId]);
    res.json({ message: "Balance added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove balance (admin only)
app.post("/api/remove", async (req, res) => {
  const { userId, amount, adminEmail } = req.body;
  try {
    const checkAdmin = await pool.query("SELECT is_admin FROM users WHERE email=$1", [adminEmail]);
    if (!checkAdmin.rows[0]?.is_admin) return res.status(403).json({ error: "Only admin can remove balance" });

    await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [amount, userId]);
    res.json({ message: "Balance removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete user (admin only)
app.delete("/api/delete/:id", async (req, res) => {
  const { adminEmail } = req.body;
  try {
    const checkAdmin = await pool.query("SELECT is_admin FROM users WHERE email=$1", [adminEmail]);
    if (!checkAdmin.rows[0]?.is_admin) return res.status(403).json({ error: "Only admin can delete users" });

    await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));