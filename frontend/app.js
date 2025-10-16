// --- DATA STORE & STATE ---
let timetableData;
let currentPage = 'upload';
let authMode = 'login';
const defaultTimetableData = {
  Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: [],
};

// --- DOM ELEMENTS ---
let loginPage, mainApp, mainContent;

// --- TEMPLATES (HTML GENERATORS) ---
const getTimetableHTML = () => { return `<div class="p-8 text-white">Timetable Page Content</div>`; };
const getReportHTML = () => { return `<div class="p-8 text-white">Report Page Content</div>`; };
const getCalculatorHTML = () => { return `<div class="p-8 text-white">Calculator Page Content</div>`; };
const getUploadHTML = () => { return `<div class="p-8 text-white">Upload Page Content</div>`; };

// --- RENDER FUNCTION ---
const renderPage = () => {
    switch (currentPage) {
        case 'timetable': mainContent.innerHTML = getTimetableHTML(); break;
        case 'report': mainContent.innerHTML = getReportHTML(); break;
        case 'calculator': mainContent.innerHTML = getCalculatorHTML(); break;
        default: mainContent.innerHTML = getUploadHTML(); break;
    }
};

// --- NAVIGATION & PAGE DISPLAY ---
const showPage = (page) => {
    if (page === 'login') {
        loginPage.classList.remove('hidden');
        mainApp.classList.add('hidden');
    } else {
        loginPage.classList.add('hidden');
        mainApp.classList.remove('hidden');
        currentPage = page;
        renderPage();
    }
};

// --- PERSISTENCE FUNCTIONS ---
async function loadData() {
    try {
        const response = await fetch('/LoginApp/getTimetable');
        if (!response.ok) { throw new Error('Failed to fetch timetable'); }
        timetableData = await response.json();
    } catch (error) {
        console.error("Could not load from server, using default.", error);
        timetableData = defaultTimetableData;
    }
}

// --- EVENT HANDLERS ---
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = '';

    let url = authMode === 'signup' ? '/LoginApp/signup' : '/LoginApp/login';
    let body = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    if (authMode === 'signup') {
        const confirmPassword = document.getElementById('confirm-password-input').value;
        const validatePassword = (pass) => {
            const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
            return re.test(pass);
        }
        if (!validatePassword(password)) {
            errorEl.textContent = 'Password: 8+ chars, with uppercase, lowercase, number, & special char.';
            return;
        }
        if (password !== confirmPassword) {
            errorEl.textContent = 'Passwords do not match.';
            return;
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        });
        const result = await response.json();

        if (response.ok) {
            if (authMode === 'login') {
                await loadData();
                showPage('timetable');
            } else {
                alert('Signup successful! Please sign in.');
                toggleAuthMode();
            }
        } else {
            errorEl.textContent = result.message || 'An error occurred.';
        }
    } catch (error) {
        console.error('Network or server error:', error);
        errorEl.textContent = 'Cannot connect to the server.';
    }
}

function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    const subtitle = document.getElementById('auth-mode-subtitle');
    const buttonText = document.getElementById('auth-submit-button');
    const toggleText = document.getElementById('auth-toggle-text');
    const toggleButton = document.getElementById('auth-toggle-button');
    const confirmPassField = document.getElementById('confirm-password-field');
    document.getElementById('auth-error').textContent = '';

    if (authMode === 'signup') {
        subtitle.textContent = 'Create an account to get started';
        buttonText.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleButton.textContent = 'Sign In';
        confirmPassField.classList.remove('hidden');
    } else {
        subtitle.textContent = 'Sign in to manage your schedule';
        buttonText.textContent = 'Sign In';
        toggleText.textContent = "Don't have an account?";
        toggleButton.textContent = 'Sign Up';
        confirmPassField.classList.add('hidden');
    }
}

function handleLogout() {
    showPage('login');
}

// --- INITIAL SETUP & GLOBAL LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    loginPage = document.getElementById('login-page');
    mainApp = document.getElementById('main-app');
    mainContent = document.getElementById('main-content');

    document.getElementById('auth-form').addEventListener('submit', handleLogin);
    document.getElementById('auth-toggle-button').addEventListener('click', toggleAuthMode);
    document.getElementById('logout-button').addEventListener('click', handleLogout);

    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));

    showPage('login');
});
