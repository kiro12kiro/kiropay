let currentUser = null;

async function signup() {
  const name = document.getElementById("signup-name").value;
  const family = document.getElementById("signup-family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !family || !email || !password) return alert("All fields are required");

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family, email, password }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);
  alert("تم إنشاء الحساب بنجاح!");
}

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  if (!email || !password) return alert("Email and Password are required");

  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  currentUser = data.user;
  showDashboard();
}

function showDashboard() {
  document.getElementById("auth-container").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("user-name").innerText = `${currentUser.name} ${currentUser.family}`;
  document.getElementById("user-balance").innerText = currentUser.balance;
  document.getElementById("user-img").src = currentUser.image || "images/default.jpg";
}

function logout() {
  currentUser = null;
  document.getElementById("auth-container").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}