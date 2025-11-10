const API_URL = "https://kiropay-web.vercel.app/api/users";

let currentUser = null;
let selectedUserId = null;

// تسجيل الدخول
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) return alert("من فضلك ادخل الإيميل وكلمة المرور");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", email, password })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  currentUser = data.user;
  showDashboard();
});

// إنشاء حساب
document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = prompt("الإيميل");
  const password = prompt("كلمة المرور");
  const name = prompt("الاسم");
  const familyName = prompt("اسم الأسرة");

  if (!email || !password || !name || !familyName) return alert("يرجى ملء جميع الحقول");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "create", email, password, name, familyName, balance: 100 })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  alert("تم إنشاء الحساب بنجاح!");
});

// عرض لوحة التحكم
async function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  document.getElementById("userName").innerText = currentUser.name;
  document.getElementById("familyName").innerText = currentUser.family_name;
  document.getElementById("balance").innerText = currentUser.balance;

  if (currentUser.is_admin) {
    document.getElementById("adminActions").style.display = "block";
    const res = await fetch(API_URL);
    const users = await res.json();
    const userSelect = document.getElementById("userSelect");
    userSelect.innerHTML = "";
    users.forEach(u => {
      const opt = document.createElement("option");
      opt.value = u.id;
      opt.text = `${u.name} ${u.family_name}`;
      userSelect.appendChild(opt);
    });
    selectedUserId = users[0].id;
    userSelect.addEventListener("change", e => selectedUserId = e.target.value);

    document.getElementById("addBalanceBtn").onclick = async () => {
      const amount = parseInt(prompt("المبلغ المراد إضافته"));
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", userId: selectedUserId, amount })
      });
      alert("تمت الإضافة!");
    };

    document.getElementById("removeBalanceBtn").onclick = async () => {
      const amount = parseInt(prompt("المبلغ المراد خصمه"));
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", userId: selectedUserId, amount })
      });
      alert("تم الخصم!");
    };

    document.getElementById("deleteUserBtn").onclick = async () => {
      if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
      await fetch(`${API_URL}?id=${selectedUserId}`, { method: "DELETE" });
      alert("تم الحذف!");
    };
  }
}

// تسجيل خروج
document.getElementById("logoutBtn").addEventListener("click", () => {
  currentUser = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
});