const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const messageDiv = document.getElementById("message");
const userName = document.getElementById("user-name");
const userFamily = document.getElementById("user-family");
const userBalance = document.getElementById("user-balance");

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.error) {
    messageDiv.innerText = data.error;
  } else {
    messageDiv.innerText = data.message;
    userName.innerText = `Name: ${data.user.name}`;
    userFamily.innerText = `Family: ${data.user.family}`;
    userBalance.innerText = `Balance: ${data.user.balance}`;
  }
});

// Sign Up
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const family = document.getElementById("family").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const res = await fetch("/api/users/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, family, email, password }),
  });
  const data = await res.json();
  messageDiv.innerText = data.message || data.error;
});