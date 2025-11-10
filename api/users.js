import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "GET") {
      const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
      return res.status(200).json(result.rows);
    }

    if (method === "POST") {
      const { action } = req.body;

      if (action === "create") {
        const { name, family, email, password, balance, isAdmin } = req.body;
        await pool.query(
          "INSERT INTO users (name, family, email, password, balance, isAdmin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING",
          [name, family, email, password, balance, isAdmin]
        );
        return res.status(200).json({ success: true, message: "User created" });
      }

      if (action === "login") {
        const { email, password } = req.body;
        const result = await pool.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password]);
        if (result.rows.length > 0) {
          return res.status(200).json({ success: true, user: result.rows[0] });
        } else {
          return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
      }

      if (action === "add") {
        const { userId, amount } = req.body;
        await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2", [amount, userId]);
        return res.status(200).json({ success: true, message: "Balance added" });
      }

      if (action === "remove") {
        const { userId, amount } = req.body;
        await pool.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [amount, userId]);
        return res.status(200).json({ success: true, message: "Balance removed" });
      }
    }

    if (method === "DELETE") {
      const { id } = req.query;
      await pool.query("DELETE FROM users WHERE id=$1", [id]);
      return res.status(200).json({ success: true, message: "User deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}