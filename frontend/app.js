const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const nameInput = document.getElementById("name");
const familyInput = document.getElementById("family_name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const dashboard = document.getElementById("dashboard");
const cardName = document.getElementById("card-name");
const cardFamily = document.getElementById("card-family");
const cardBalance = document.getElementById("card-balance");
const adminControls = document.getElementById("admin-controls");

let currentUser = null;
let isAdmin = false;

// Replace with your backend API URL
const API_URL = "/api/users";

async function createAccount() {
  const user = {
    name: nameInput.value,
    family_name: familyInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    balance: 100
  };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", ...user })
  });
  const data = await res.json();
  alert(data.message);
}

async function login() {
  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await fetch(API_URL);
  const users = await res.json();

  const user = users.find(u => u.email === email);
  if (!user) return alert("المستخدم غير موجود");

  // For simplicity password check is skipped
  currentUser = user;
  isAdmin = email === "admin@kiropay.com";
  updateDashboard();
}

function updateDashboard() {
  document.getElementById("signup-login").style.display = "none";
  dashboard.style.display = "block";

  cardName.textContent = currentUser.name;
  cardFamily.textContent = currentUser.family_name;
  cardBalance.textContent = "الرصيد: " + currentUser.balance;

  if (isAdmin) adminControls.style.display = "block";
}

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  dashboard.style.display = "none";
  document.getElementById("signup-login").style.display = "block";
});

signupBtn.addEventListener("click", createAccount);
loginBtn.addEventListener("click", login);