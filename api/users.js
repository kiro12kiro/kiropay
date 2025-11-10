import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "POST") {
      const { action } = req.body;

      if (action === "create") {
        const { name, family, email, password } = req.body;
        if (!password) return res.json({ error: "Password is required" });
        await pool.query(
          "INSERT INTO users (name, family, email, password, balance, isAdmin) VALUES ($1,$2,$3,$4,100,false) ON CONFLICT (email) DO NOTHING",
          [name, family, email, password]
        );
        return res.json({ message: "User created" });
      }

      if (action === "login") {
        const { email, password } = req.body;
        if (!password) return res.json({ error: "Password is required" });

        const result = await pool.query(
          "SELECT * FROM users WHERE email=$1 AND password=$2",
          [email, password]
        );
        if (result.rows.length === 0)
          return res.json({ error: "Invalid email or password" });
        return res.json({ user: result.rows[0] });
      }
    }

    res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}