const API_BASE = "https://kiropay-web.vercel.app/api"; // backend link
const statusDiv = document.getElementById("status");
const usersDiv = document.getElementById("users");

async function getUsers() {
  statusDiv.innerText = "🔄 Fetching users...";
  try {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();
    usersDiv.innerHTML = data
      .map(
        (u) => `
      <div class="user">
        <h3>${u.name}</h3>
        <p>Balance: ${u.balance}💰</p>
        <button onclick="add(${u.id})">+ Add</button>
        <button onclick="remove(${u.id})">- Remove</button>
        <button onclick="del(${u.id})">🗑 Delete</button>
      </div>`
      )
      .join("");
    statusDiv.innerText = "✅ Loaded successfully!";
  } catch (err) {
    statusDiv.innerText = "❌ Error loading users!";
  }
}

async function add(id) {
  const amount = prompt("Enter amount to add:");
  statusDiv.innerText = "Adding balance...";
  await fetch(`${API_BASE}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: id, amount: +amount }),
  });
  getUsers();
}

async function remove(id) {
  const amount = prompt("Enter amount to remove:");
  statusDiv.innerText = "Removing balance...";
  await fetch(`${API_BASE}/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: id, amount: +amount }),
  });
  getUsers();
}

async function del(id) {
  if (!confirm("Are you sure?")) return;
  statusDiv.innerText = "Deleting user...";
  await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
  getUsers();
}

async function searchUser() {
  const query = document.getElementById("search").value.toLowerCase();
  const res = await fetch(`${API_BASE}/users`);
  const data = await res.json();
  const filtered = data.filter((u) => u.name.toLowerCase().includes(query));
  usersDiv.innerHTML = filtered
    .map(
      (u) => `
    <div class="user">
      <h3>${u.name}</h3>
      <p>Balance: ${u.balance}💰</p>
    </div>`
    )
    .join("");
}

getUsers();