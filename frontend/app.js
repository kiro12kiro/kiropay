/* frontend/app.js
   استعمال: ضع هذا الملف في kiropay/frontend/app.js
   عدّل قيمة API_BASE إلى رابط الباك اند على Vercel.
*/

const API_BASE = "https://kiropay-web.vercel.app/"; // <-- غيّر هذا إلى رابط الباك اند على Vercel

// عناصر DOM (تتوافق مع index.html الموجود عندك)
const loginFormEl = document.getElementById("login-form");
const signupFormEl = document.getElementById("signup-form");
const walletEl = document.getElementById("wallet");

const loginEmailEl = document.getElementById("loginEmail");
const loginPasswordEl = document.getElementById("loginPassword");
const loginBtnEl = document.getElementById("loginBtn");

const firstNameEl = document.getElementById("firstName");
const lastNameEl = document.getElementById("lastName");
const signupEmailEl = document.getElementById("signupEmail");
const signupPasswordEl = document.getElementById("signupPassword");
const avatarEl = document.getElementById("avatar");
const signupBtnEl = document.getElementById("signupBtn");

const userAvatarEl = document.getElementById("userAvatar");
const userNameEl = document.getElementById("userName");
const userLastNameEl = document.getElementById("userLastName");
const userBalanceEl = document.getElementById("userBalance");
const logoutBtnEl = document.getElementById("logoutBtn");

// status element (لو موجود في HTML) أو نستخدم alert كبديل
let statusEl = document.getElementById("statusMessage");
function setStatus(msg, isError = false) {
  if (statusEl) {
    statusEl.innerText = msg;
    statusEl.style.color = isError ? "#b00020" : "#0a8a00";
  } else {
    // لو مفيش عنصر عرض الحالة، نستخدم console و alert خفيف
    console.log(msg);
    if (isError) alert("خطأ: " + msg);
  }
}

// Helper: تحويل response إلى JSON بأمان
async function parseJSON(resp) {
  try {
    return await resp.json();
  } catch (e) {
    return null;
  }
}

// --- تسجيل حساب جديد (FormData لأن فيه ملف ممكن يُرفع) ---
async function registerUser() {
  const firstName = firstNameEl.value.trim();
  const lastName = lastNameEl.value.trim();
  const email = signupEmailEl.value.trim();
  const password = signupPasswordEl.value;

  if (!firstName || !lastName || !email || !password) {
    setStatus("اكمل كل الحقول من فضلك", true);
    return;
  }

  setStatus("جاري إنشاء الحساب...");
  try {
    const fd = new FormData();
    fd.append("firstName", firstName);
    fd.append("lastName", lastName);
    fd.append("email", email);
    fd.append("password", password);
    if (avatarEl && avatarEl.files && avatarEl.files[0]) {
      fd.append("avatar", avatarEl.files[0]);
    }

    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      body: fd
    });
    const data = await parseJSON(res);
    if (!res.ok || !data || data.status === "error") {
      const msg = data && data.message ? data.message : "فشل إنشاء الحساب";
      setStatus(msg, true);
      return;
    }

    // تسجيل دخول تلقائي بعد الإنشاء
    setStatus("تم إنشاء الحساب. جاري تسجيل الدخول...");
    // عرض المحفظة مباشرة من بيانات اليوزر اللي رجعت
    const user = data.user;
    saveUserToLocal(user);
    showWallet(user);
    setStatus("تم تسجيل الدخول بنجاح ✅");
  } catch (err) {
    console.error("signup error", err);
    setStatus("حدث خطأ أثناء الاتصال بالخادم", true);
  }
}

// --- تسجيل دخول ---
async function loginUser() {
  const email = loginEmailEl.value.trim();
  const password = loginPasswordEl.value;
  if (!email || !password) {
    setStatus("ادخل الايميل و كلمة المرور", true);
    return;
  }

  setStatus("جاري تسجيل الدخول...");
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await parseJSON(res);
    if (!res.ok || !data || data.status === "error") {
      const msg = data && data.message ? data.message : "فشل تسجيل الدخول";
      setStatus(msg, true);
      return;
    }
    const user = data.user;
    saveUserToLocal(user);
    showWallet(user);
    setStatus("تم تسجيل الدخول بنجاح ✅");
  } catch (err) {
    console.error("login error", err);
    setStatus("حدث خطأ أثناء الاتصال بالخادم", true);
  }
}

// --- عرض المحفظة وتغيير الواجهة ---
function showWallet(user) {
  // اخفاء نماذج الدخول والتسجيل، اظهار المحفظة
  if (loginFormEl) loginFormEl.style.display = "none";
  if (signupFormEl) signupFormEl.style.display = "none";
  if (walletEl) walletEl.style.display = "block";

  // عرض بيانات المستخدم
  userAvatarEl.src = user.avatar ? (user.avatar.startsWith("/uploads") ? user.avatar : (`${API_BASE}/uploads/${user.avatar}`)) : "default.jpg";
  userNameEl.innerText = user.first_name || user.firstName || user.first_name;
  userLastNameEl.innerText = user.last_name || user.lastName || "";
  userBalanceEl.innerText = "الرصيد: " + (user.balance != null ? user.balance : 0);

  // لو المستخدم ادمن: اظهار ادوات الادمن (لو موجودة في HTML)
  const adminPanel = document.getElementById("adminPanel");
  if (adminPanel) {
    if ((user.role && user.role.toLowerCase() === "admin") || user.email === "admin@kiropay.com") {
      adminPanel.style.display = "block";
      setStatus("مرحباً مدير النظام (Admin)");
    } else {
      adminPanel.style.display = "none";
    }
  }
}

// --- تسجيل خروج ---
function logout() {
  localStorage.removeItem("kiropay_user");
  if (walletEl) walletEl.style.display = "none";
  if (loginFormEl) loginFormEl.style.display = "block";
  if (signupFormEl) signupFormEl.style.display = "block";
  setStatus("تم تسجيل الخروج");
}

// --- حفظ واسترجاع اليوزر محلياً ---
function saveUserToLocal(user) {
  localStorage.setItem("kiropay_user", JSON.stringify(user));
}
function getUserFromLocal() {
  const s = localStorage.getItem("kiropay_user");
  return s ? JSON.parse(s) : null;
}

// --- جلب بيانات مستخدم مباشر (مثلاً لتحديث بعد تعديل رصيد) ---
async function fetchUserByEmail(email) {
  try {
    const res = await fetch(`${API_BASE}/user/${encodeURIComponent(email)}`);
    const data = await parseJSON(res);
    if (res.ok && data && data.success) return data.user;
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ---------------- Admin utilities (if admin UI exists) ----------------

// Search user (calls GET /search?q=...)
async function searchUser(query) {
  try {
    setStatus("جاري البحث...");
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
    const data = await parseJSON(res);
    if (!res.ok || !data || data.success === false) {
      setStatus(data && data.message ? data.message : "فشل البحث", true);
      return [];
    }
    setStatus(`وجد ${data.users.length} نتيجة`);
    return data.users;
  } catch (err) {
    console.error(err);
    setStatus("خطأ في البحث", true);
    return [];
  }
}

// Update balance (adminEmail required)
async function adminUpdateBalance(adminEmail, targetEmail, amount) {
  try {
    setStatus("جاري تحديث الرصيد...");
    const res = await fetch(`${API_BASE}/admin/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminEmail, targetEmail, amount })
    });
    const data = await parseJSON(res);
    if (!res.ok || !data || data.success === false) {
      setStatus(data && data.message ? data.message : "فشل التحديث", true);
      return null;
    }
    setStatus("تم تحديث الرصيد");
    return data.balance != null ? data.balance : (data.user && data.user.balance);
  } catch (err) {
    console.error(err);
    setStatus("خطأ أثناء تحديث الرصيد", true);
    return null;
  }
}

// Delete user (admin)
async function adminDeleteUser(adminEmail, targetEmail) {
  try {
    if (!confirm("متأكد أنك عايز تحذف الحساب؟")) return false;
    setStatus("جاري حذف الحساب...");
    const res = await fetch(`${API_BASE}/admin/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminEmail, targetEmail })
    });
    const data = await parseJSON(res);
    if (!res.ok || !data || data.success === false) {
      setStatus(data && data.message ? data.message : "فشل الحذف", true);
      return false;
    }
    setStatus("تم حذف الحساب");
    return true;
  } catch (err) {
    console.error(err);
    setStatus("خطأ أثناء الحذف", true);
    return false;
  }
}

// ---------------- UI bindings (connect buttons to functions) ----------------

if (signupBtnEl) signupBtnEl.addEventListener("click", (e) => { e.preventDefault(); registerUser(); });
if (loginBtnEl) loginBtnEl.addEventListener("click", (e) => { e.preventDefault(); loginUser(); });
if (logoutBtnEl) logoutBtnEl.addEventListener("click", (e) => { e.preventDefault(); logout(); });

// Optional admin-panel bindings if your index.html contains these IDs:
// #adminPanel, #searchInput, #searchBtn, #resultsList, #amountInput, #addBtn, #subtractBtn, #deleteBtn
const searchBtn = document.getElementById("searchBtn");
if (searchBtn) {
  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const q = document.getElementById("searchInput").value.trim();
    if (!q) { setStatus("اكتب شيء للبحث", true); return; }
    const users = await searchUser(q);
    const listEl = document.getElementById("resultsList");
    if (listEl) {
      listEl.innerHTML = "";
      users.forEach(u => {
        const li = document.createElement("div");
        li.className = "result-item";
        li.innerHTML = `<strong>${u.first_name} ${u.last_name}</strong> — ${u.email} — رصيد: ${u.balance}`;
        li.addEventListener("click", ()=> {
          // عند اختيار مستخدم من القائمة نحفظ الايميل في عنصر محدد
          document.getElementById("selectedUserEmail").value = u.email;
          document.getElementById("selectedUserLabel").innerText = `${u.first_name} ${u.last_name} (${u.email})`;
        });
        listEl.appendChild(li);
      });
    }
  });
}

// Add/subtract buttons
const addBtn = document.getElementById("addBtn");
const subtractBtn = document.getElementById("subtractBtn");
if (addBtn) addBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const admin = getUserFromLocal();
  if (!admin) { setStatus("سجل دخول كأدمن أولاً", true); return; }
  const target = document.getElementById("selectedUserEmail").value;
  const amount = Number(document.getElementById("amountInput").value || 0);
  if (!target || !amount) { setStatus("حدد مستخدم وادخل مبلغ صحيح", true); return; }
  const newBal = await adminUpdateBalance(admin.email, target, amount);
  if (newBal != null) {
    setStatus("الرصيد أصبح: " + newBal);
    // تحديث عرض المستخدم الحالي لو هو نفس اليوزر
    const local = getUserFromLocal();
    if (local && local.email === target) {
      local.balance = newBal; saveUserToLocal(local); showWallet(local);
    }
  }
});
if (subtractBtn) subtractBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const admin = getUserFromLocal();
  if (!admin) { setStatus("سجل دخول كأدمن أولاً", true); return; }
  const target = document.getElementById("selectedUserEmail").value;
  const amount = Number(document.getElementById("amountInput").value || 0);
  if (!target || !amount) { setStatus("حدد مستخدم وادخل مبلغ صحيح", true); return; }
  const newBal = await adminUpdateBalance(admin.email, target, -amount);
  if (newBal != null) {
    setStatus("الرصيد أصبح: " + newBal);
    const local = getUserFromLocal();
    if (local && local.email === target) {
      local.balance = newBal; saveUserToLocal(local); showWallet(local);
    }
  }
});

// Delete
const deleteBtn = document.getElementById("deleteBtn");
if (deleteBtn) deleteBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const admin = getUserFromLocal();
  if (!admin) { setStatus("سجل دخول كأدمن أولاً", true); return; }
  const target = document.getElementById("selectedUserEmail").value;
  if (!target) { setStatus("حدد مستخدم للحذف", true); return; }
  const ok = await adminDeleteUser(admin.email, target);
  if (ok) {
    setStatus("تم الحذف بنجاح");
    // اختياري: ازالة من واجهة النتائج
  }
});

// --- عند تحميل الصفحة: لو فيه يوزر مخزن نعرضه ---
window.addEventListener("DOMContentLoaded", () => {
  const saved = getUserFromLocal();
  if (saved) {
    showWallet(saved);
    setStatus("معك جلسة مسجَّلة");
  }
});