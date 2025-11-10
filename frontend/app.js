const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const showSignupBtn = document.getElementById("show-signup-btn");
const backLoginBtn = document.getElementById("back-login-btn");

const addBtn = document.getElementById("add-btn");
const removeBtn = document.getElementById("remove-btn");
const deleteBtn = document.getElementById("delete-btn");
const searchBtn = document.getElementById("search-btn");

const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard");
const adminPanel = document.getElementById("admin-panel");

let currentUser = null;
let currentTargetUser = null;

// Switch to signup
showSignupBtn.addEventListener("click", () => {
  loginContainer.style.display = "none";
  signupContainer.style.display = "block";
});

// Back to login
backLoginBtn.addEventListener("click", () => {
  signupContainer.style.display = "none";
  loginContainer.style.display = "block";
});

// تسجيل دخول
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });
  const data = await res.json();
  if (data.success) {
    currentUser = data.user;
    showDashboard();
  } else alert(data.message);
});

// إنشاء حساب
signupBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family, email, password }),
  });
  const data = await res.json();
  if (data.success) {
    alert("تم إنشاء الحساب بنجاح");
    signupContainer.style.display = "none";
    loginContainer.style.display = "block";
  } else alert(data.message);
});

// Dashboard
function showDashboard() {
  loginContainer.style.display = "none";
  signupContainer.style.display = "none";
  dashboard.style.display = "block";

  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("card-name").textContent = currentUser.name;
  document.getElementById("card-family").textContent = currentUser.family;
  document.getElementById("user-balance").textContent = currentUser.balance;

  if (currentUser.isadmin) {
    adminPanel.style.display = "block";
    currentTargetUser = currentUser;
  } else adminPanel.style.display = "none";
}

// تسجيل خروج
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  dashboard.style.display = "none";
  loginContainer.style.display = "block";
});

// Admin actions
searchBtn.addEventListener("click", async () => {
  const email = document.getElementById("search-email").value;
  const res = await fetch("/api/users?email=" + email);
  const data = await res.json();
  if (data.length) {
    currentTargetUser = data[0];
    alert(`تم العثور على المستخدم: ${currentTargetUser.name}`);
  } else alert("لا يوجد مستخدم بهذا البريد");
});

addBtn.addEventListener("click", async () => {
  const amount = Number(document.getElementById("amount").value);
  await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", userId: currentTargetUser.id, amount }),
  });
  alert("تم إضافة الرصيد");
});

removeBtn.addEventListener("click", async () => {
  const amount = Number(document.getElementById("amount").value);
  await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", userId: currentTargetUser.id, amount }),
  });
  alert("تم خصم الرصيد");
});

deleteBtn.addEventListener("click", async () => {
  await fetch("/api/users?id=" + currentTargetUser.id, { method: "DELETE" });
  alert("تم حذف الحساب");
});