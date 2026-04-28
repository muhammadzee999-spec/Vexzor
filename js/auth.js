document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const authLink = document.querySelector('.auth-link');
    const authLinkText = authLink ? authLink.querySelector('.hide-mobile') : null;

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser && authLink && authLinkText) {
        // Update nav link to show Logout
        authLink.innerHTML = `<i class="fa fa-sign-out-alt"></i> <span class="hide-mobile">LOGOUT</span>`;
        authLink.href = "#"; // Prevent default navigation
        
        // Add logout functionality
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            alert('Logged out successfully!');
            window.location.reload();
        });
    }

    // Handle Signup
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;

            // Basic validation
            if (!name || !email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if email already exists
            const userExists = users.some(u => u.email === email);
            if (userExists) {
                alert('Email already registered! Please login.');
                return;
            }

            // Save new user
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));

            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Find matching user
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                // Save session
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, email: user.email }));
                alert('Login successful!');
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password.');
            }
        });
    }
});
