import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req, res) {
  const { method } = req;
  const { email, password, action, name, family } = req.body || {};

  try {
    if (method === "GET") {
      const queryEmail = req.query.email;
      const queryPassword = req.query.password;
      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1 AND password=$2",
        [queryEmail, queryPassword]
      );
      return res.status(200).json(result.rows);
    }

    if (method === "POST" && action === "create") {
      await pool.query(
        "INSERT INTO users (name, family, email, password, balance, isAdmin) VALUES ($1,$2,$3,$4,0,false) ON CONFLICT (email) DO NOTHING",
        [name, family, email, password]
      );
      return res.status(200).json({ message: "تم إنشاء الحساب بنجاح" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}