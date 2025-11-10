// backend/server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Config ----------
const FALLBACK_DB = 'postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
// الأفضل وضع هذا في Vercel Environment Variable باسم DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL || FALLBACK_DB;

const pool = new Pool({ connectionString: DATABASE_URL });

// ملفّات الرفع داخل frontend/uploads ليظهر للموقع
const uploadsDir = path.join(__dirname, '..', 'frontend', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Serve static uploaded images
app.use('/uploads', express.static(uploadsDir));

// ---------- SQL table needed ----------
/*
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  balance INTEGER DEFAULT 100,
  image_url TEXT DEFAULT '/uploads/default.jpg',
  role VARCHAR(20) DEFAULT 'user', -- 'user' or 'admin'
  created_at TIMESTAMP DEFAULT now()
);
*/

// ---------- Helpers ----------
async function findUserByEmail(email) {
  const r = await pool.query('SELECT id, first_name, last_name, email, balance, image_url, role FROM users WHERE email=$1', [email]);
  return r.rows[0] || null;
}

// ---------- Endpoints ----------

// Signup - multipart/form-data (avatar optional)
app.post('/signup', upload.single('avatar'), async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ success:false, message:'كل الحقول مطلوبة' });

    // check exists
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(400).json({ success:false, message:'الإيميل موجود بالفعل' });

    const hash = await bcrypt.hash(password, 10);
    const image_url = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg';

    const q = `INSERT INTO users (first_name,last_name,email,password_hash,image_url) VALUES ($1,$2,$3,$4,$5) RETURNING id, first_name,last_name,email,balance,image_url,role`;
    const r = await pool.query(q, [firstName, lastName, email, hash, image_url]);

    res.json({ success:true, user: r.rows[0] });
  } catch (err) {
    console.error('signup error', err);
    res.status(500).json({ success:false, message: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, message:'ادخل الايميل والباسورد' });

    const r = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!r.rows.length) return res.status(401).json({ success:false, message:'المستخدم غير موجود' });

    const user = r.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ success:false, message:'كلمة المرور خاطئة' });

    // لا ترجع الحقول الحساسة
    const safe = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      balance: user.balance,
      image_url: user.image_url,
      role: user.role
    };
    res.json({ success:true, user: safe });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ success:false, message: err.message });
  }
});

// Get single user by email (public for demo - in real app protect)
app.get('/user/:email', async (req, res) => {
  try {
    const u = await findUserByEmail(req.params.email);
    if (!u) return res.status(404).json({ success:false, message:'User not found' });
    res.json({ success:true, user:u });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: err.message });
  }
});

// Get all users (admin)
app.get('/users', async (req, res) => {
  try {
    const r = await pool.query('SELECT id, first_name, last_name, email, balance, image_url, role FROM users ORDER BY id DESC');
    res.json({ success:true, users: r.rows });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: err.message });
  }
});

// Search users (admin) - q in query string
app.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ success:true, users: [] });
    const r = await pool.query(
      `SELECT id, first_name, last_name, email, balance, image_url, role
       FROM users WHERE email ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1 LIMIT 50`,
      [`%${q}%`]
    );
    res.json({ success:true, users: r.rows });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: err.message });
  }
});

// Admin: update balance (amount can be negative)
app.post('/admin/balance', async (req, res) => {
  try {
    const { adminEmail, targetEmail, amount } = req.body;
    if (!adminEmail || !targetEmail || typeof amount === 'undefined') return res.status(400).json({ success:false, message:'Missing fields' });

    // check admin
    const admin = await pool.query('SELECT role FROM users WHERE email=$1', [adminEmail]);
    if (!admin.rows.length || admin.rows[0].role !== 'admin') return res.status(403).json({ success:false, message:'Not authorized' });

    await pool.query('BEGIN');
    const t = await pool.query('SELECT balance FROM users WHERE email=$1 FOR UPDATE', [targetEmail]);
    if (!t.rows.length) { await pool.query('ROLLBACK'); return res.status(404).json({ success:false, message:'Target user not found' }); }
    const newBalance = Number(t.rows[0].balance) + Number(amount);
    await pool.query('UPDATE users SET balance=$1 WHERE email=$2', [newBalance, targetEmail]);
    await pool.query('COMMIT');
    res.json({ success:true, balance:newBalance });
  } catch (err) {
    await pool.query('ROLLBACK').catch(()=>{});
    console.error(err); res.status(500).json({ success:false, message: err.message });
  }
});

// Admin: delete user
app.post('/admin/delete', async (req, res) => {
  try {
    const { adminEmail, targetEmail } = req.body;
    if (!adminEmail || !targetEmail) return res.status(400).json({ success:false, message:'Missing fields' });

    const admin = await pool.query('SELECT role FROM users WHERE email=$1', [adminEmail]);
    if (!admin.rows.length || admin.rows[0].role !== 'admin') return res.status(403).json({ success:false, message:'Not authorized' });

    await pool.query('DELETE FROM users WHERE email=$1', [targetEmail]);
    res.json({ success:true });
  } catch (err) {
    console.error(err); res.status(500).json({ success:false, message: err.message });
  }
});

// Health
app.get('/', (req, res) => res.send({ ok:true, msg:'kiropay backend' }));

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));