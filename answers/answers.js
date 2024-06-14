document.addEventListener('DOMContentLoaded', () => {
    fetch('typeform-title-id.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Connexion à l\'API impossible');
            }
            return response.json();
        })
        .then(data => {
            displayResponses(data[0]);
        })
        .catch(error => {
            console.error('Une erreur est survenue pendant la récupération des données:', error);
        });
});

function displayResponses(form) {
    const responseList = document.getElementById('response-list');
    const responseCount = document.getElementById('response-count');
    const uniqueUsers = new Set();

    form.content.forEach(question => {
        question.answers.forEach(answer => {
            uniqueUsers.add(answer.id_user);
        });

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('card-content');

        const questionTitle = document.createElement('h3');
        questionTitle.classList.add('body-m');
        questionTitle.textContent = question.intitule;
        questionDiv.appendChild(questionTitle);

        const responseCountElem = document.createElement('p');
        responseCountElem.classList.add('body-s');
        responseCountElem.textContent = `Nombre de réponses : ${question.answers.length}`;
        questionDiv.appendChild(responseCountElem);

        const responseListElem = document.createElement('ul');
        responseListElem.classList.add('response-list');

        if (question.type === 'unique' || question.type === 'multiple') {
            question.reponses.forEach(reponse => {
                const responseText = document.createElement('li');
                responseText.classList.add('response-list-item', 'body-xs');
                responseText.textContent = reponse.text;
                responseListElem.appendChild(responseText);
            });
        } else if (question.type === 'freeText') {
            question.answers.forEach(answer => {
                const responseText = document.createElement('li');
                responseText.classList.add('response-list-item', 'body-xs');
                responseText.textContent = answer.value;
                responseListElem.appendChild(responseText);
            });
        }

        questionDiv.appendChild(responseListElem);
        responseList.appendChild(questionDiv);
    });

    responseCount.textContent = `Nombre de réponses : ${uniqueUsers.size}`;
}

function exportCSV() {
    // Logique pour exporter en CSV
}

function exportPDF() {
    // Logique pour exporter en PDF
}