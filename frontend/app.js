const apiUrl = '/api/users';

let currentUser = null;

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const messageDiv = document.getElementById('message');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if(!email || !password) { messageDiv.innerText = "ادخل البريد وكلمة السر"; return; }

  const res = await fetch(apiUrl);
  const users = await res.json();
  const user = users.find(u => u.email === email && u.password === password);

  if(!user) { messageDiv.innerText = "بيانات غير صحيحة"; return; }

  currentUser = user;
  messageDiv.innerText = `تم تسجيل الدخول بنجاح!`;
  showDashboard();
});

signupBtn.addEventListener('click', async () => {
  const name = document.getElementById('signup-name').value;
  const family = document.getElementById('signup-family').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if(!name || !family || !email || !password) { messageDiv.innerText = "املأ جميع البيانات"; return; }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('family', family);
  formData.append('email', email);
  formData.append('password', password);
  
  const img = document.getElementById('signup-image').files[0];
  if(img) formData.append('image', img);

  const res = await fetch(apiUrl, { method: 'POST', body: JSON.stringify({
    action: 'create', name, family, email, password, balance:100
  }), headers:{'Content-Type':'application/json'}});
  
  const data = await res.json();
  messageDiv.innerText = data.message;
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  location.reload();
});

function showDashboard() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('signup-section').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';

  document.getElementById('card-name').innerText = currentUser.name;
  document.getElementById('card-family').innerText = currentUser.family;
  document.getElementById('card-balance').innerText = `الرصيد: ${currentUser.balance}`;

  if(currentUser.isAdmin) {
    document.getElementById('admin-actions').style.display = 'block';
  }
}