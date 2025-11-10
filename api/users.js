import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === "POST" && req.body.action === "signup") {
      const { email, password } = req.body;
      const result = await pool.query(
        "INSERT INTO users (email, password, balance, isAdmin, name, family) VALUES ($1, $2, 0, false, 'User', 'UserFamily') ON CONFLICT (email) DO NOTHING RETURNING *",
        [email, password]
      );
      if (result.rows.length === 0) return res.json({ success: false, message: "المستخدم موجود مسبقاً" });
      return res.json({ success: true, user: result.rows[0] });
    }

    if (method === "POST" && req.body.action === "login") {
      const { email, password } = req.body;
      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1 AND password=$2",
        [email, password]
      );
      if (result.rows.length === 0) return res.json({ success: false, message: "خطأ في البريد أو كلمة المرور" });
      return res.json({ success: true, user: result.rows[0] });
    }

    return res.status(405).json({ success: false, message: "Method not allowed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}