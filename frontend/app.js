const API_URL = "https://kiropay.vercel.app/api/users";

const statusDiv = document.getElementById("status");
const usersDiv = document.getElementById("users");
const refreshBtn = document.getElementById("refresh");
const createBtn = document.getElementById("create");

async function loadUsers() {
  statusDiv.textContent = "جارِ تحميل البيانات...";
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    usersDiv.innerHTML = "";

    users.forEach((user) => {
      const div = document.createElement("div");
      div.className = "user";
      div.innerHTML = `
        <div>
          <strong>${user.name}</strong><br>
          💰 ${user.balance} جنيه
        </div>
        <div>
          <button onclick="addBalance(${user.id})">+ رصيد</button>
          <button onclick="removeBalance(${user.id})">- رصيد</button>
          <button onclick="deleteUser(${user.id})">❌</button>
        </div>
      `;
      usersDiv.appendChild(div);
    });

    statusDiv.textContent = "تم تحميل المستخدمين ✅";
  } catch (err) {
    statusDiv.textContent = "حدث خطأ أثناء الاتصال بالسيرفر ❌";
  }
}

async function addBalance(id) {
  const amount = prompt("أدخل المبلغ الذي تريد إضافته:");
  if (!amount) return;
  statusDiv.textContent = "جاري إضافة الرصيد...";
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "add", userId: id, amount: parseFloat(amount) }),
  });
  loadUsers();
}

async function removeBalance(id) {
  const amount = prompt("أدخل المبلغ الذي تريد خصمه:");
  if (!amount) return;
  statusDiv.textContent = "جاري خصم الرصيد...";
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "remove", userId: id, amount: parseFloat(amount) }),
  });
  loadUsers();
}

async function deleteUser(id) {
  if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
  statusDiv.textContent = "جاري حذف المستخدم...";
  await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
  loadUsers();
}

createBtn.onclick = async () => {
  const name = document.getElementById("name").value;
  const balance = document.getElementById("balance").value;
  if (!name || !balance) return alert("يرجى إدخال الاسم والرصيد");
  statusDiv.textContent = "جاري إنشاء المستخدم...";
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", name, balance: parseFloat(balance) }),
  });
  document.getElementById("name").value = "";
  document.getElementById("balance").value = "";
  loadUsers();
};

refreshBtn.onclick = loadUsers;
window.onload = loadUsers;