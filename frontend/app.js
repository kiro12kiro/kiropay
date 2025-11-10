const API_URL = "http://localhost:5000";

// تسجيل الدخول
document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if(data.status === "success") {
    showWallet(data.user);
  } else alert(data.message);
};

// إنشاء حساب
document.getElementById("signupBtn").onclick = async () => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const avatarFile = document.getElementById("avatar").files[0];

  const formData = new FormData();
  formData.append("firstName", firstName);
  formData.append("lastName", lastName);
  formData.append("email", email);
  formData.append("password", password);
  if(avatarFile) formData.append("avatar", avatarFile);

  const res = await fetch(`${API_URL}/signup`, { method: "POST", body: formData });
  const data = await res.json();
  if(data.status === "success") showWallet(data.user);
  else alert(data.message);
};

// عرض المحفظة
function showWallet(user) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("signup-form").style.display = "none";
  document.getElementById("wallet").style.display = "block";

  document.getElementById("userName").innerText = user.first_name;
  document.getElementById("userLastName").innerText = user.last_name;
  document.getElementById("userBalance").innerText = "الرصيد: " + user.balance;
  document.getElementById("userAvatar").src = user.avatar ? `uploads/${user.avatar}` : "default.jpg";
}

// تسجيل خروج
document.getElementById("logoutBtn").onclick = () => {
  document.getElementById("wallet").style.display = "none";
  document.getElementById("login-form").style.display = "block";
  document.getElementById("signup-form").style.display = "block";
};
