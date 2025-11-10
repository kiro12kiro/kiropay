import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req, res) {
  const { method } = req;

  try {
    // تسجيل الدخول
    if (method === "GET") {
      const { email, password } = req.query;
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2",
        [email, password]
      );
      return res.status(200).json(result.rows);
    }

    // إنشاء مستخدم أو تعديل رصيد
    if (method === "POST") {
      const { action, name, family, email, password, userId, amount } = req.body;

      if (action === "create") {
        await pool.query(
          "INSERT INTO users (name, family, email, password, balance, isadmin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING",
          [name, family, email, password, 0, false]
        );
        return res.status(200).json({ message: "تم إنشاء المستخدم" });
      }

      if (action === "add") {
        await pool.query(
          "UPDATE users SET balance = balance + $1 WHERE id = $2",
          [amount, userId]
        );
        return res.status(200).json({ message: "تم إضافة الرصيد" });
      }

      if (action === "remove") {
        await pool.query(
          "UPDATE users SET balance = balance - $1 WHERE id = $2",
          [amount, userId]
        );
        return res.status(200).json({ message: "تم حذف الرصيد" });
      }
    }

    // حذف مستخدم
    if (method === "DELETE") {
      const { id } = req.query;
      await pool.query("DELETE FROM users WHERE id = $1", [id]);
      return res.status(200).json({ message: "تم حذف المستخدم" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}