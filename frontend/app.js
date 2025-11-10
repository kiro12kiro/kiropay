const apiUrl = "/api/users";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const familyInput = document.getElementById("family_name");

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");

const dashboard = document.getElementById("dashboard");
const authSection = document.getElementById("auth-section");

const userName = document.getElementById("user-name");
const userFamily = document.getElementById("user-family");
const userBalance = document.getElementById("user-balance");
const cardImg = document.getElementById("card-img");

const adminSection = document.getElementById("admin-section");
const amountInput = document.getElementById("amount");
const userIdInput = document.getElementById("userId");
const addBalanceBtn = document.getElementById("add-balance-btn");
const removeBalanceBtn = document.getElementById("remove-balance-btn");
const deleteUserBtn = document.getElementById("delete-user-btn");

let currentUser = null;

// Signup
signupBtn.onclick = async () => {
  if (!emailInput.value || !passwordInput.value) return alert("البريد وكلمة المرور مطلوبين!");

  const res = await fetch(apiUrl + "/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value,
      family_name: familyInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      balance: 0,
      is_admin: false
    })
  });
  const data = await res.json();
  alert(data.message);
};

// Login
loginBtn.onclick = async () => {
  if (!emailInput.value || !passwordInput.value) return alert("البريد وكلمة المرور مطلوبين!");
  
  const res = await fetch(apiUrl);
  const users = await res.json();
  const user = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);

  if (!user) return alert("المستخدم غير موجود أو كلمة المرور خاطئة!");
  
  currentUser = user;
  authSection.classList.add("hidden");
  dashboard.classList.remove("hidden");

  userName.textContent = user.name;
  userFamily.textContent = user.family_name;
  userBalance.textContent = user.balance;
  cardImg.src = "images/default.jpg";

  if (user.is_admin) adminSection.classList.remove("hidden");
};

// Logout
logoutBtn.onclick = () => {
  currentUser = null;
  dashboard.classList.add("hidden");
  authSection.classList.remove("hidden");
};

// Admin actions
addBalanceBtn.onclick = async () => {
  if (!currentUser || !currentUser.is_admin) return;
  const res = await fetch(apiUrl + "/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userIdInput.value, amount: Number(amountInput.value) })
  });
  const data = await res.json();
  alert(data.message);
};

removeBalanceBtn.onclick = async () => {
  if (!currentUser || !currentUser.is_admin) return;
  const res = await fetch(apiUrl + "/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userIdInput.value, amount: Number(amountInput.value) })
  });
  const data = await res.json();
  alert(data.message);
};

deleteUserBtn.onclick = async () => {
  if (!currentUser || !currentUser.is_admin) return;
  const res = await fetch(`${apiUrl}/delete/${userIdInput.value}`, { method: "DELETE" });
  const data = await res.json();
  alert(data.message);
};