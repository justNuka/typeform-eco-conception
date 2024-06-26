document.addEventListener('DOMContentLoaded', () => {
    const TOKEN = localStorage.getItem('jwt'); // Récupérer le token JWT depuis le stockage local

    if (!TOKEN) {
        redirectToLogin();
    } else {
        // Valider le token côté serveur
        fetch('https://typeformapi.leod1.fr/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token invalide');
            }
            return response.json();
        })
        .then(data => {
            console.log('Token validé:', data);
            // L'utilisateur est connecté
        })
        .catch(error => {
            console.error('Erreur:', error);
            redirectToLogin();
        });
    }

    function redirectToLogin() {
        alert('Vous devez être connecté pour voir cette page.');
        window.location.href = '../login-register/login-register.html'; // Rediriger vers la page de connexion si non connecté
    }
});