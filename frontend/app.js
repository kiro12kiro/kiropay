const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const messageDiv = document.getElementById("message");
let currentUser = null;

// Helper: عرض الرسائل
function showMessage(text, type = "info") {
  messageDiv.innerText = text;
  messageDiv.style.color = type === "error" ? "red" : "green";
}

// تسجيل دخول
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showMessage("الرجاء إدخال البريد وكلمة المرور", "error");
    return;
  }

  showMessage("جاري تسجيل الدخول...");

  try {
    const res = await fetch(`/api/users?email=${email}&password=${password}`);
    const data = await res.json();

    if (data.length === 0) {
      showMessage("خطأ: البريد أو كلمة المرور غير صحيحة", "error");
      return;
    }

    currentUser = data[0];
    showMessage("تم تسجيل الدخول بنجاح");
    showDashboard();
  } catch (err) {
    showMessage("حدث خطأ أثناء تسجيل الدخول", "error");
    console.error(err);
  }
});

// إنشاء حساب
signupBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !family || !email || !password) {
    showMessage("الرجاء تعبئة كل الحقول", "error");
    return;
  }

  showMessage("جاري إنشاء الحساب...");

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name, family, email, password }),
    });
    const data = await res.json();
    showMessage(data.message);
  } catch (err) {
    showMessage("حدث خطأ أثناء إنشاء الحساب", "error");
    console.error(err);
  }
});

// تسجيل خروج
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "none";
});

// عرض داشبورد المستخدم
function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "block";
  document.getElementById("card-name").innerText = currentUser.name;
  document.getElementById("card-family").innerText = currentUser.family;
  document.getElementById("balance").innerText = currentUser.balance;

  // إذا الأدمن أظهر أزرار الإدارة
  if (currentUser.isadmin) {
    showAdminControls();
  }
}

// الأدمن: إضافة واجهة لإدارة المستخدمين
function showAdminControls() {
  const adminDiv = document.createElement("div");
  adminDiv.id = "admin-controls";
  adminDiv.innerHTML = `
    <h3>لوحة الأدمن</h3>
    <input type="number" id="admin-amount" placeholder="المبلغ">
    <input type="number" id="admin-user-id" placeholder="ID المستخدم">
    <button id="add-balance-btn">إضافة رصيد</button>
    <button id="remove-balance-btn">حذف رصيد</button>
    <button id="delete-user-btn">حذف مستخدم</button>
    <button id="fetch-users-btn">عرض كل المستخدمين</button>
    <div id="admin-message"></div>
    <pre id="users-list"></pre>
  `;
  document.getElementById("user-dashboard").appendChild(adminDiv);

  // إضافة الأحداث
  document.getElementById("add-balance-btn").onclick = adminAddBalance;
  document.getElementById("remove-balance-btn").onclick = adminRemoveBalance;
  document.getElementById("delete-user-btn").onclick = adminDeleteUser;
  document.getElementById("fetch-users-btn").onclick = adminFetchUsers;
}

async function adminAddBalance() {
  const userId = document.getElementById("admin-user-id").value;
  const amount = document.getElementById("admin-amount").value;
  const msg = document.getElementById("admin-message");
  msg.innerText = "جاري إضافة الرصيد...";

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", userId, amount }),
    });
    const data = await res.json();
    msg.innerText = data.message;
  } catch (err) {
    msg.innerText = "حدث خطأ";
  }
}

async function adminRemoveBalance() {
  const userId = document.getElementById("admin-user-id").value;
  const amount = document.getElementById("admin-amount").value;
  const msg = document.getElementById("admin-message");
  msg.innerText = "جاري حذف الرصيد...";

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", userId, amount }),
    });
    const data = await res.json();
    msg.innerText = data.message;
  } catch (err) {
    msg.innerText = "حدث خطأ";
  }
}

async function adminDeleteUser() {
  const userId = document.getElementById("admin-user-id").value;
  const msg = document.getElementById("admin-message");
  msg.innerText = "جاري حذف المستخدم...";

  try {
    const res = await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
    const data = await res.json();
    msg.innerText = data.message;
  } catch (err) {
    msg.innerText = "حدث خطأ";
  }
}

async function adminFetchUsers() {
  const res = await fetch("/api/users");
  const data = await res.json();
  document.getElementById("users-list").innerText = JSON.stringify(data, null, 2);
}