import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req, res) {
  const { method } = req;
  try {
    if (method === "POST") {
      const { action, email, password, name, family } = req.body;

      if (action === "login") {
        const result = await pool.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password]);
        if (result.rows.length) {
          return res.status(200).json({ success: true, user: result.rows[0] });
        } else {
          return res.status(200).json({ success: false, message: "البريد الإلكتروني أو كلمة المرور خاطئة" });
        }
      }

      if (action === "create") {
        await pool.query(
          "INSERT INTO users (name, family, email, password, balance, isAdmin) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (email) DO NOTHING",
          [name, family, email, password, 100, false]
        );
        return res.status(200).json({ success: true });
      }
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}