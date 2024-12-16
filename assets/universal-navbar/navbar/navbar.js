

// Modal toggle logic

const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const closeModalButton = document.querySelector('.close-button');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

loginButton.addEventListener('click', () => {
    loginModal.classList.add('show');
});

closeModalButton.addEventListener('click', () => {
    loginModal.classList.remove('show');
});

loginTab.addEventListener('click', () => {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
});

signupTab.addEventListener('click', () => {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
});

// Sliding panel logic
const slideToggle = document.getElementById("slide-toggle");
const slidingMain = document.getElementById("sliding-main-container");

slideToggle.addEventListener("click", () => {
    slidingMain.classList.toggle("open");
});


document.addEventListener("DOMContentLoaded", function () {
    // Check if the login form exists before adding the event listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const usernameOrEmail = document.querySelector('input[name="usernameOrEmail"]').value;
        const password = document.querySelector('input[name="password"]').value;
  
        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usernameOrEmail, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('Login successful!');
        } else {
          alert(data.message);
        }
      });
    } else {
      console.error("Login form not found.");
    }
  
    // Check if the signup form exists before adding the event listener
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const email = document.querySelector('input[name="email"]').value;
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const confirmPassword = document.querySelector('input[name="confirm-password"]').value;
  
        const response = await fetch('/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, password, confirmPassword }),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('User registered successfully!');
        } else {
          alert(data.message);
        }
      });
    } else {
      console.error("Signup form not found.");
    }
  });
  