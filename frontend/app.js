const apiUrl = "/api/users";

async function createAccount() {
  const name = document.getElementById("name").value;
  const family_name = document.getElementById("family_name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, family_name, email, password }),
  });
  const data = await res.json();
  alert(data.message);
}

async function login() {
  const email = document.getElementById("login_email").value;
  const password = document.getElementById("login_password").value;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password }),
  });
  const user = await res.json();

  if (user.error) return alert(user.error);

  document.getElementById("user_name").innerText = user.name;
  document.getElementById("user_family").innerText = user.family_name;
  document.getElementById("user_balance").innerText = user.balance;
  document.getElementById("card_image").src = user.image || "./images/default.jpg";
}