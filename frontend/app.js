const apiUrl = "/api/users";

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const nameInput = document.getElementById("name");
const familyNameInput = document.getElementById("family_name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const authDiv = document.getElementById("auth");
const dashboardDiv = document.getElementById("dashboard");
const userFullName = document.getElementById("userFullName");
const balanceEl = document.getElementById("balance");

signupBtn.addEventListener("click", async () => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "create",
      name: nameInput.value,
      family_name: familyNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    }),
  });
  const data = await res.json();
  alert(data.message);
});

loginBtn.addEventListener("click", async () => {
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "login",
      email: emailInput.value,
      password: passwordInput.value,
    }),
  });
  const data = await res.json();
  if (res.status !== 200) return alert(data.message);
  authDiv.style.display = "none";
  dashboardDiv.style.display = "block";
  userFullName.innerText = `${data.name} ${data.family_name}`;
  balanceEl.innerText = `Balance: ${data.balance}`;
});

logoutBtn.addEventListener("click", () => {
  dashboardDiv.style.display = "none";
  authDiv.style.display = "block";
});