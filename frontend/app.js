const API_URL = "/api/users";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authDiv = document.getElementById("auth");
const userPanel = document.getElementById("userPanel");

const userNameEl = document.getElementById("userName");
const userFamilyEl = document.getElementById("userFamily");
const balanceEl = document.getElementById("balance");

let currentUser = null;

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) return alert("الرجاء إدخال البريد وكلمة المرور");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password })
  });
  const data = await res.json();
  if (data.success) showUser(data.user);
  else alert(data.message);
});

signupBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) return alert("الرجاء إدخال البريد وكلمة المرور");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "signup", email, password })
  });
  const data = await res.json();
  if (data.success) showUser(data.user);
  else alert(data.message);
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  userPanel.style.display = "none";
  authDiv.style.display = "block";
});

function showUser(user) {
  currentUser = user;
  userNameEl.textContent = user.name;
  userFamilyEl.textContent = user.family;
  balanceEl.textContent = user.balance;
  authDiv.style.display = "none";
  userPanel.style.display = "block";
}