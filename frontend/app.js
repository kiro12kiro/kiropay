// بيانات تجريبية - يمكنك ربطها بقاعدة بيانات Neon لاحقًا
const users = [
  { firstName: "Admin", lastName: "AdminFamily", email: "admin@kiropay.com", password: "Admin1234!", balance: 1000, role: "admin" }
];

let currentUser = null;

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("welcome").innerText = `أهلا ${currentUser.firstName}`;
  document.getElementById("cardName").innerText = currentUser.firstName;
  document.getElementById("cardFamily").innerText = currentUser.lastName;
  document.getElementById("cardBalance").innerText = `الرصيد: ${currentUser.balance}`;

  if(currentUser.role === "admin"){
    document.getElementById("admin-controls").style.display = "block";
  }
}

signupBtn.addEventListener("click", () => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if(!firstName || !lastName || !email || !password){
    alert("جميع الحقول مطلوبة!");
    return;
  }

  if(users.some(u => u.email === email)){
    alert("هذا البريد الإلكتروني مسجل مسبقًا");
    return;
  }

  const newUser = { firstName, lastName, email, password, balance: 100, role: "user" };
  users.push(newUser);
  currentUser = newUser;
  showDashboard();
});

loginBtn.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const user = users.find(u => u.email === email && u.password === password);
  if(!user){
    alert("البريد الإلكتروني أو كلمة المرور خاطئة");
    return;
  }

  currentUser = user;
  showDashboard();
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
});