document.getElementById("loginBtn").onclick = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // مؤقتا نستخدم تسجيل دخول وهمي
  if (email === "admin@kiropay.com" && password === "Admin1234!") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("user-section").style.display = "block";
    document.getElementById("userName").innerText = "Admin";
    document.getElementById("cardName").innerText = "Admin Name";
    document.getElementById("cardFamily").innerText = "Admin Family";
  } else {
    alert("Invalid login");
  }
};

document.getElementById("logoutBtn").onclick = () => {
  document.getElementById("login-section").style.display = "block";
  document.getElementById("user-section").style.display = "none";
};