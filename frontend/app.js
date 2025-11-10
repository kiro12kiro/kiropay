const loginContainer = document.getElementById("loginContainer");
const signupContainer = document.getElementById("signupContainer");
const dashboard = document.getElementById("dashboard");
const adminPanel = document.getElementById("adminPanel");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const cardName = document.getElementById("cardName");
const cardFamily = document.getElementById("cardFamily");
const cardBalance = document.getElementById("cardBalance");

let currentUser = null;

const API_URL = "/api/users.js";

// التبديل بين تسجيل الدخول وإنشاء حساب
showSignup.addEventListener("click", ()=>{loginContainer.style.display="none";signupContainer.style.display="block";});
showLogin.addEventListener("click", ()=>{signupContainer.style.display="none";loginContainer.style.display="block";});

// تسجيل دخول
loginBtn.addEventListener("click", async ()=>{
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch(API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"login", email, password})});
  const data = await res.json();
  if(data.success){currentUser=data.user;showDashboard();} else alert(data.message);
});

// إنشاء حساب
signupBtn.addEventListener("click", async ()=>{
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const res = await fetch(API_URL, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({action:"create", name,family,email,password})});
  const data = await res.json();
  if(data.success){alert("تم إنشاء الحساب"); signupContainer.style.display="none"; loginContainer.style.display="block";} else alert(data.message);
});

// تسجيل خروج
logoutBtn.addEventListener("click", ()=>{
  currentUser=null;dashboard.style.display="none";loginContainer.style.display="block";
});

// عرض لوحة التحكم
function showDashboard(){
  loginContainer.style.display="none";
  signupContainer.style.display="none";
  dashboard.style.display="block";
  cardName.textContent=currentUser.name;
  cardFamily.textContent=currentUser.family;
  cardBalance.textContent="الرصيد: "+currentUser.balance;
  if(currentUser.isAdmin) adminPanel.style.display="block"; else adminPanel.style.display="none";
}