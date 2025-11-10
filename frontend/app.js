const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
let currentUser = null;

const API_URL = "/api/users";

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password })
  });
  const data = await res.json();
  if (data.success) {
    currentUser = data.user;
    showDashboard();
  } else {
    alert(data.message);
  }
});

signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = prompt("ادخل الاسم");
  const family = prompt("ادخل اسم العائلة");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family, email, password, balance:0, isAdmin:false })
  });
  const data = await res.json();
  if (data.success) alert("تم إنشاء الحساب بنجاح");
  else alert(data.message);
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  document.getElementById("auth").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
});

function showDashboard() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("cardName").innerText = `${currentUser.name} ${currentUser.family}`;
  document.getElementById("balance").innerText = currentUser.balance;
  document.getElementById("cardImage").src = "images/default.jpg";
}