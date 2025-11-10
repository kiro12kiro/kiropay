const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");

const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const dashboard = document.getElementById("dashboard");

const cardName = document.getElementById("card-name");
const cardFamily = document.getElementById("card-family");
const cardBalance = document.getElementById("card-balance");

const adminActions = document.getElementById("admin-actions");

let currentUser = null;

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);
  currentUser = data.user;

  showDashboard();
}

async function signup() {
  const name = document.getElementById("signup-name").value;
  const family = document.getElementById("signup-family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const res = await fetch(`/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family, email, password }),
  });

  const data = await res.json();
  if (data.error) return alert(data.error);
  alert("User created, please login!");
}

function showDashboard() {
  loginContainer.style.display = "none";
  signupContainer.style.display = "none";
  dashboard.style.display = "block";

  cardName.textContent = currentUser.name;
  cardFamily.textContent = currentUser.family;
  cardBalance.textContent = currentUser.balance;

  if (currentUser.isAdmin) adminActions.style.display = "block";
}

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  dashboard.style.display = "none";
  loginContainer.style.display = "block";
});
loginBtn.addEventListener("click", login);
signupBtn.addEventListener("click", signup);