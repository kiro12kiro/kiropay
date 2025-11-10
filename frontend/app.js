const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const dashboard = document.getElementById("dashboard");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");

let currentUser = null;

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  const res = await fetch(`/api/users`, { method: "GET" });
  const users = await res.json();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) return alert("خطأ في البريد أو كلمة السر");
  currentUser = user;
  showDashboard();
}

async function signup() {
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const imageFile = document.getElementById("image").files[0];
  
  let imageUrl = "images/default.jpg";
  if (imageFile) imageUrl = URL.createObjectURL(imageFile);
  
  const res = await fetch(`/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family, email, password, image: imageUrl })
  });
  alert("تم إنشاء الحساب");
  signupForm.style.display = "none";
  loginForm.style.display = "block";
}

function showDashboard() {
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  dashboard.style.display = "block";
  
  document.getElementById("card-name").innerText = currentUser.name;
  document.getElementById("card-family").innerText = currentUser.family;
  document.getElementById("balance").innerText = "الرصيد: " + currentUser.balance;
  document.getElementById("card-image").src = currentUser.image || "images/default.jpg";
}

loginBtn.addEventListener("click", login);
signupBtn.addEventListener("click", signup);
logoutBtn.addEventListener("click", () => location.reload());