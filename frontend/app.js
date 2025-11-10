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

// واجهة تسجيل دخول
function renderLogin() {
  document.body.innerHTML = `
    <div class="login">
      <h2>تسجيل دخول</h2>
      <input id="email" placeholder="البريد الإلكتروني"/>
      <button onclick="login(document.getElementById('email').value)">تسجيل دخول</button>
      <button onclick="renderSignup()">إنشاء حساب</button>
    </div>
  `;
}

// واجهة إنشاء حساب
function renderSignup() {
  document.body.innerHTML = `
    <div class="signup">
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
  await createUser(name, family_name, email, 100);
  alert("تم إنشاء الحساب!");
  renderLogin();
}

// واجهة داشبورد
async function renderDashboard(user) {
  const isAdmin = user.email === "admin@kiropay.com";
  const users = await getUsers();

  let usersHtml = "";
  if (isAdmin) {
    usersHtml = users.map(u => `
      <div class="user">
        <p>${u.name} ${u.family_name} - الرصيد: ${u.balance}</p>
        <button onclick="addBalance(${u.id}, 50)">إضافة 50</button>
        <button onclick="removeBalance(${u.id}, 50)">سحب 50</button>
        <button onclick="deleteUser(${u.id})">حذف</button>
      </div>
    `).join("");
  }

  document.body.innerHTML = `
    <div class="dashboard">
      <h2>مرحبًا ${user.name} ${user.family_name}</h2>
      <div class="visa-card">
        <img src="images/default.jpg" alt="card image"/>
        <h3>${user.name} ${user.family_name}</h3>
        <p>Kiropay Visa</p>
      </div>
      <p>الرصيد: ${user.balance}</p>
      <button onclick="logout()">تسجيل خروج</button>
      <div class="admin-actions">${usersHtml}</div>
    </div>
  `;
}

const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
currentUser ? renderDashboard(currentUser) : renderLogin();