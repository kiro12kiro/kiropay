const API_URL = "/api/users";

let currentUser = null;

document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // الأدمن
  if (email === "admin@kiropay.com" && password === "Admin1234!") {
    currentUser = { role: "admin", name: "Admin", familyName: "AdminFamily" };
    document.getElementById("admin-section").style.display = "block";
  } else {
    currentUser = { role: "user", name: email.split("@")[0], familyName: "" };
    document.getElementById("admin-section").style.display = "none";
  }

  document.getElementById("login-section").style.display = "none";
  document.getElementById("user-section").style.display = "block";
  document.getElementById("userName").innerText = currentUser.name;
  document.getElementById("cardName").innerText = currentUser.name;
  document.getElementById("cardFamily").innerText = currentUser.familyName;
};

document.getElementById("logoutBtn").onclick = () => {
  document.getElementById("login-section").style.display = "block";
  document.getElementById("user-section").style.display = "none";
  currentUser = null;
};

// وظيفة البحث وإضافة/حذف الرصيد
document.getElementById("searchBtn").onclick = async () => {
  const searchName = document.getElementById("searchName").value;
  const res = await fetch(API_URL);
  const users = await res.json();
  const found = users.find(u => u.name.toLowerCase() === searchName.toLowerCase());
  if (found) {
    currentUser.id = found.id;
    currentUser.balance = found.balance;
    document.getElementById("cardName").innerText = found.name;
    document.getElementById("cardFamily").innerText = found.family_name || "";
    document.getElementById("cardBalance").innerText = `Balance: ${found.balance}`;
  } else alert("User not found");
};

document.getElementById("addBalanceBtn").onclick = async () => {
  const amount = parseInt(document.getElementById("balanceAmount").value);
  if (!currentUser.id) return alert("Select a user first");
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", userId: currentUser.id, amount }),
  });
  alert("Balance added");
};

document.getElementById("removeBalanceBtn").onclick = async () => {
  const amount = parseInt(document.getElementById("balanceAmount").value);
  if (!currentUser.id) return alert("Select a user first");
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", userId: currentUser.id, amount }),
  });
  alert("Balance removed");
};

document.getElementById("deleteUserBtn").onclick = async () => {
  if (!currentUser.id) return alert("Select a user first");
  await fetch(`${API_URL}?id=${currentUser.id}`, { method: "DELETE" });
  alert("User deleted");
};