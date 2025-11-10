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
    if (method === "POST" && req.body.action === "create") {
      const { name, family, email, password, image } = req.body;
      await pool.query(
        "INSERT INTO users (name, family, email, password, balance, image) VALUES ($1,$2,$3,$4,100,$5) ON CONFLICT (email) DO NOTHING",
        [name, family, email, password, image]
      );
      return res.status(200).json({ message: "User created" });
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}