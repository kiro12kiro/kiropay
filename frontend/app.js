const API_URL = "/api/users";

// تسجيل دخول
async function login(email, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });
  return res.json();
}

// إنشاء حساب
async function createAccount(name, family, email, password) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family, email, password }),
  });
  return res.json();
}

// إضافة/حذف رصيد (الإدمن فقط)
async function updateBalance(userId, amount, type) {
  const action = type === "add" ? "addBalance" : "removeBalance";
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, userId, amount }),
  });
  return res.json();
}

// استدعاء جميع المستخدمين (للإدمن فقط)
async function getUsers() {
  const res = await fetch(API_URL);
  return res.json();
}