const API_URL = "https://kiropay-web.vercel.app/api/users";

async function loadUsers() {
  const res = await fetch(API_URL);
  const users = await res.json();
  console.log(users);
}

async function createUser(name, balance = 0) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, balance }),
  });
  const data = await res.json();
  alert(data.message);
}

async function addBalance(userId, amount) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", userId, amount }),
  });
  const data = await res.json();
  alert(data.message);
}