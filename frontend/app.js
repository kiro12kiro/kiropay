// بيانات المستخدمين التجريبية (في نسخة حقيقية، تجيبها من Neon DB)
let users = [];
let currentUser = null;

// عرض/إخفاء تسجيل الدخول وإنشاء الحساب
const loginDiv = document.getElementById("loginDiv");
const signupDiv = document.getElementById("signupDiv");
const dashboard = document.getElementById("dashboard");

document.getElementById("showSignup").onclick = () => {
  loginDiv.style.display = "none";
  signupDiv.style.display = "block";
};

document.getElementById("showLogin").onclick = () => {
  signupDiv.style.display = "none";
  loginDiv.style.display = "block";
};

// إنشاء حساب
document.getElementById("signupBtn").onclick = () => {
  const name = document.getElementById("signupName").value.trim();
  const family = document.getElementById("signupFamily").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const imageInput = document.getElementById("signupImage");

  if (!name || !family || !email || !password) {
    alert("الرجاء ملء جميع الحقول");
    return;
  }

  const image = imageInput.files[0] ? URL.createObjectURL(imageInput.files[0]) : "images/default.jpg";

  // إضافة المستخدم
  users.push({
    id: Date.now(),
    name,
    family,
    email,
    password,
    balance: 100, // رصيد أولي للمستخدم العادي
    image
  });

  alert("تم إنشاء الحساب بنجاح!");
  signupDiv.style.display = "none";
  loginDiv.style.display = "block";
};

// تسجيل الدخول
document.getElementById("loginBtn").onclick = () => {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
    return;
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("البريد الإلكتروني أو كلمة المرور خاطئة");
    return;
  }

  currentUser = user;
  showDashboard();
};

// عرض لوحة التحكم
function showDashboard() {
  loginDiv.style.display = "none";
  signupDiv.style.display = "none";
  dashboard.style.display = "block";

  document.getElementById("userFullName").innerText = `${currentUser.name} ${currentUser.family}`;
  document.getElementById("userBalance").innerText = currentUser.balance;
  document.getElementById("userImage").src = currentUser.image;

  // صلاحيات الادمن
  const adminPanel = document.getElementById("adminPanel");
  if (currentUser.email === "admin@kiropay.com") {
    adminPanel.style.display = "block";
  } else {
    adminPanel.style.display = "none";
  }
}

// تسجيل خروج
document.getElementById("logoutBtn").onclick = () => {
  currentUser = null;
  dashboard.style.display = "none";
  loginDiv.style.display = "block";
};