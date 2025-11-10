import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
      return res.status(200).json(result.rows);
    }

    if (method === "POST" && req.body.action === "create") {
      const { name, balance } = req.body;
      await pool.query("INSERT INTO users (name, balance) VALUES ($1, $2)", [
        name,
        balance,
      ]);
      return res.status(200).json({ message: "User created" });
    }

    if (method === "POST" && req.body.action === "add") {
      const { userId, amount } = req.body;
      await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [
        amount,
        userId,
      ]);
      return res.status(200).json({ message: "Balance added" });
    }

    if (method === "POST" && req.body.action === "remove") {
      const { userId, amount } = req.body;
      await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [
        amount,
        userId,
      ]);
      return res.status(200).json({ message: "Balance removed" });
    }

    if (method === "DELETE") {
      const { id } = req.query;
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return res.status(200).json({ message: "User deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}