const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// connection string Neon
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// مثال: جلب كل المستخدمين
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('خطأ في جلب المستخدمين');
  }
});

// تشغيل السيرفر
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));