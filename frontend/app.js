const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const dashboard = document.getElementById("user-dashboard");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/users", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ action:"login", email, password })
  });
  const data = await res.json();
  if(data.message === "Invalid credentials"){ alert("خطأ في البيانات"); return; }
  loginForm.style.display = "none";
  registerForm.style.display = "none";
  dashboard.style.display = "block";
  document.getElementById("user-name").innerText = data.name + " " + data.family_name;
  document.getElementById("user-balance").innerText = data.balance;
});

registerBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const family_name = document.getElementById("family_name").value;
  const email = document.getElementById("reg-email").value;
  const password = document.getElementById("reg-password").value;
  await fetch("/api/users", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ action:"create", name, family_name, email, password, role:"user", balance:100 })
  });
  alert("تم إنشاء الحساب");
});

logoutBtn.addEventListener("click", () => {
  dashboard.style.display = "none";
  loginForm.style.display = "block";
  registerForm.style.display = "block";
});