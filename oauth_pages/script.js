const flipContainer = document.getElementById('flipContainer');

const goToSignup = document.getElementById('goToSignup');
const goToLogin = document.getElementById('goToLogin');

const signupForm = document.getElementById('signupForm');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');
const signupPassword = document.getElementById('signupPassword');

const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');

goToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    flipContainer.classList.add('flipped');
});
goToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    flipContainer.classList.remove('flipped');
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = signupName.value.trim();
    const emailVal = signupEmail.value.trim();
    const passVal = signupPassword.value;

    if (!nameVal || !emailVal || !passVal) {
        alert("All fields are required!");
        return;
    }
    if (passVal.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }

    const userData = {
        name: nameVal,
        email: emailVal,
        password: passVal
    };
    localStorage.setItem('user', JSON.stringify(userData));

    alert("Account created successfully!");

    flipContainer.classList.remove('flipped');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailVal = loginEmail.value.trim();
    const passVal = loginPassword.value;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        alert("No user found. Please sign up first.");
        return;
    }

    if (emailVal === storedUser.email && passVal === storedUser.password) {
        alert("Login successful!");
    } else {
        alert("Invalid credentials!");
    }
});