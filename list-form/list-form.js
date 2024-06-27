document.addEventListener('DOMContentLoaded', () => {
    const formList = document.getElementById('form-list');
    const TOKEN = localStorage.getItem('jwt');

    // Ajouter des gestionnaires d'événements pour les boutons
    document.getElementById('create-form').addEventListener('click', () => {
        window.location.href = '../create-form/create-form.html';
    });

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('jwt');
        window.location.href = '../login-register/login-register.html';
    });

    fetch('https://typeformapi.leod1.fr/forms', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des IDs de formulaires');
        }
        return response.json();
    })
    .then(formIds => {
        return Promise.all(formIds.map(id => getFormDetails(id)));
    })
    .then(forms => {
        displayForms(forms);
    })
    .catch(error => {
        alert('Erreur lors de la récupération des formulaires');
    });

    function getFormDetails(id) {
        return fetch(`https://typeformapi.leod1.fr/forms/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du formulaire avec ID ${id}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    }

    function displayForms(forms) {
        console.log('Displaying forms:', forms);

        // Vérifier si aucun formulaire n'a été trouvé
        if (forms.length === 0 || forms.every(form => !form)) {
            const noFormsMessage = document.createElement('p');
            noFormsMessage.textContent = "Aucun formulaire n'a été trouvé pour votre profil.";
            noFormsMessage.classList.add('body-m');
            formList.appendChild(noFormsMessage);
            return;
        }

        forms.forEach(form => {
            if (form) {
                console.log('Processing form:', form);
                const listItem = document.createElement('li');
                listItem.classList.add('form-list-item');

                const formTitleLink = document.createElement('a');
                formTitleLink.href = `../answers/answers.html?formId=${form.form_id}`;
                formTitleLink.textContent = form.form_title || 'Titre indisponible';
                formTitleLink.classList.add('form-title-link');

                const formTitle = document.createElement('h3');
                formTitle.appendChild(formTitleLink);

                const responseCount = document.createElement('p');
                const responseLength = form.responses ? form.responses.length : 0;
                responseCount.textContent = `Nombre de réponses : ${responseLength}`;

                listItem.appendChild(formTitle);
                listItem.appendChild(responseCount);
                formList.appendChild(listItem);
            }
        });
    }
});