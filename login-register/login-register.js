document.addEventListener('DOMContentLoaded', () => {
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Basculer entre les formulaires
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    });

    // Gestion de l'inscription
    registerForm.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault();
        const username = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;

        fetch('https://typeformapi.leod1.fr/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'inscription');
            }
            return response.json();
        })
        .then(data => {
            console.log('Nouvel utilisateur:', data);
            registerForm.reset();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });

    // Gestion de la connexion
    loginForm.querySelector('button').addEventListener('click', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        fetch('https://typeformapi.leod1.fr/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la connexion');
            }
            return response.json();
        })
        .then(data => {
            // Stocker le token JWT pour une utilisation ultérieure
            localStorage.setItem('jwt', data.accessToken);
            // Redirection ou autre traitement après connexion réussie
            window.location.href = '../list-form/list-form.html';
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    });
});