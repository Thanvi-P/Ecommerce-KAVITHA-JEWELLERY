// js/auth.js
let currentUser = null;

function loadAuthState() {
    const savedUser = localStorage.getItem('kavita_user');
    if(savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtnNav');
    const userInfoDiv = document.getElementById('userInfo');
    if(currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${currentUser.name.split(' ')[0]}`;
        if(userInfoDiv) userInfoDiv.innerHTML = `<div class="user-name">${currentUser.name}</div><div class="user-email">${currentUser.email}</div>`;
    } else {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> Account`;
        if(userInfoDiv) userInfoDiv.innerHTML = `<div class="user-name">Guest User</div><div class="user-email">Login to access account</div>`;
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('kavita_user');
    updateAuthUI();
    showToast('Logged out successfully! 👋');
}

function openAuthModal() { document.getElementById('authModal').classList.add('active'); }
function closeAuthModal() { document.getElementById('authModal').classList.remove('active'); }

function initAuth() {
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtnNav');
    const closeBtn = document.getElementById('closeModal');
    const logoutBtn = document.getElementById('logoutBtn');
    const authTabs = document.querySelectorAll('.auth-tab');
    const switchLinks = document.querySelectorAll('[data-switch]');
    
    if(logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); logout(); });
    loginBtn.addEventListener('click', (e) => { e.preventDefault(); if(!currentUser) openAuthModal(); });
    closeBtn.addEventListener('click', closeAuthModal);
    modal.addEventListener('click', (e) => { if(e.target === modal) closeAuthModal(); });
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('loginForm').classList.remove('active');
            document.getElementById('signupForm').classList.remove('active');
            if(tab.dataset.auth === 'login') document.getElementById('loginForm').classList.add('active');
            else document.getElementById('signupForm').classList.add('active');
        });
    });
    
    switchLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.switch;
            authTabs.forEach(t => t.classList.remove('active'));
            if(target === 'login') {
                document.querySelector('[data-auth="login"]').classList.add('active');
                document.getElementById('loginForm').classList.add('active');
                document.getElementById('signupForm').classList.remove('active');
            } else {
                document.querySelector('[data-auth="signup"]').classList.add('active');
                document.getElementById('signupForm').classList.add('active');
                document.getElementById('loginForm').classList.remove('active');
            }
        });
    });
    
    document.getElementById('doLoginBtn').addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem('kavita_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if(user) {
            currentUser = user;
            localStorage.setItem('kavita_user', JSON.stringify(user));
            updateAuthUI();
            closeAuthModal();
            showToast(`Welcome back ${user.name}! ✨`);
        } else showToast('Invalid credentials. Please sign up first.');
    });
    
    document.getElementById('doSignupBtn').addEventListener('click', () => {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        if(password !== confirm) { showToast('Passwords do not match!'); return; }
        const users = JSON.parse(localStorage.getItem('kavita_users') || '[]');
        if(users.find(u => u.email === email)) { showToast('Email already exists!'); return; }
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('kavita_users', JSON.stringify(users));
        currentUser = newUser;
        localStorage.setItem('kavita_user', JSON.stringify(newUser));
        updateAuthUI();
        closeAuthModal();
        showToast('Account created! Welcome to Kavitha Jewellery 💛');
    });
    
    loadAuthState();
}