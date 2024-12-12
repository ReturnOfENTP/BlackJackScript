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
