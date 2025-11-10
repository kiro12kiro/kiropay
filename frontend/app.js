const apiUrl = "/api/users";

async function getUsers() {
  const res = await fetch(apiUrl);
  return res.json();
}

async function createUser(name, family_name, email, balance) {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family_name, email, balance }),
  });
  return res.json();
}

async function addBalance(userId, amount) {
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", userId, amount }),
  });
}

async function removeBalance(userId, amount) {
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", userId, amount }),
  });
}

async function deleteUser(userId) {
  await fetch(`${apiUrl}?id=${userId}`, { method: "DELETE" });
}

// تسجيل دخول
async function login(email) {
  const users = await getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return alert("User not found");
  sessionStorage.setItem("currentUser", JSON.stringify(user));
  renderDashboard(user);
}

// تسجيل خروج
function logout() {
  sessionStorage.removeItem("currentUser");
  renderLogin();
}

// عرض واجهة تسجيل دخول
function renderLogin() {
  document.body.innerHTML = `
    <div>
      <h2>تسجيل دخول</h2>
      <input id="email" placeholder="البريد الإلكتروني"/>
      <button onclick="login(document.getElementById('email').value)">تسجيل دخول</button>
      <button onclick="renderSignup()">إنشاء حساب</button>
    </div>
  `;
}

// عرض واجهة إنشاء حساب
function renderSignup() {
  document.body.innerHTML = `
    <div>
      <h2>إنشاء حساب</h2>
      <input id="name" placeholder="الاسم"/>
      <input id="family_name" placeholder="اسم الأسرة"/>
      <input id="email" placeholder="البريد الإلكتروني"/>
      <button onclick="signup()">إنشاء</button>
      <button onclick="renderLogin()">رجوع</button>
    </div>
  `;
}

async function signup() {
  const name = document.getElementById("name").value;
  const family_name = document.getElementById("family_name").value;
  const email = document.getElementById("email").value;
  await createUser(name, family_name, email, 100); // مستخدم جديد يبدأ برصيد 100
  alert("تم إنشاء الحساب!");
  renderLogin();
}

// عرض داشبورد بعد تسجيل الدخول
function renderDashboard(user) {
  document.body.innerHTML = `
    <div>
      <h2>مرحبًا ${user.name} ${user.family_name}</h2>
      <p>الرصيد: ${user.balance}</p>
      <button onclick="logout()">تسجيل خروج</button>
    </div>
  `;
}

// بدء الصفحة
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
currentUser ? renderDashboard(currentUser) : renderLogin();