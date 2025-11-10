const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const messageDiv = document.getElementById("message");

let currentUser = null;

// تسجيل دخول
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    messageDiv.innerText = "الرجاء إدخال البريد وكلمة المرور";
    return;
  }

  try {
    const res = await fetch(`/api/users?email=${email}&password=${password}`);
    const data = await res.json();

    if (data.length === 0) {
      messageDiv.innerText = "خطأ: البريد أو كلمة المرور غير صحيحة";
      return;
    }

    currentUser = data[0];
    showDashboard();
  } catch (err) {
    messageDiv.innerText = "حدث خطأ أثناء تسجيل الدخول";
    console.error(err);
  }
});

// إنشاء حساب
signupBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  if (!name || !family || !email || !password) {
    messageDiv.innerText = "الرجاء تعبئة كل الحقول";
    return;
  }

  try {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", name, family, email, password }),
    });
    const data = await res.json();
    messageDiv.innerText = data.message;
  } catch (err) {
    messageDiv.innerText = "حدث خطأ أثناء إنشاء الحساب";
    console.error(err);
  }
});

// تسجيل خروج
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "none";
});

// عرض داشبورد المستخدم
function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("user-dashboard").style.display = "block";
  document.getElementById("card-name").innerText = currentUser.name;
  document.getElementById("card-family").innerText = currentUser.family;
  document.getElementById("balance").innerText = currentUser.balance;
}