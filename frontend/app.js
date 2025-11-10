const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard");

let currentUser = null;

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
  } else {
    alert(data.message);
  }
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
    body: JSON.stringify({
      action: "create",
      name,
      family,
      email,
      password,
    }),
  });
  const data = await res.json();
  if (data.success) {
    alert("تم إنشاء الحساب بنجاح");
    loginContainer.style.display = "block";
    signupContainer.style.display = "none";
  } else {
    alert(data.message);
  }
});

// تسجيل خروج
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  dashboard.style.display = "none";
  loginContainer.style.display = "block";
});

function showDashboard() {
  loginContainer.style.display = "none";
  signupContainer.style.display = "none";
  dashboard.style.display = "block";
  document.getElementById("user-name").textContent = currentUser.name;
  document.getElementById("card-name").textContent = currentUser.name;
  document.getElementById("card-family").textContent = currentUser.family;
  document.getElementById("user-balance").textContent = currentUser.balance;
}