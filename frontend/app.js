const API_BASE = "https://kiropay.vercel.app/api/users";

async function loadUsers() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  document.getElementById("output").innerHTML = JSON.stringify(data, null, 2);
}

async function createUser() {
  const name = prompt("Enter user name:");
  const balance = parseFloat(prompt("Enter starting balance:"));
  await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, balance }),
  });
  alert("User created!");
  loadUsers();
}