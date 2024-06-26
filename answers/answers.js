document.addEventListener('DOMContentLoaded', () => {
    const TOKEN = localStorage.getItem('jwt');
    const urlParams = new URLSearchParams(window.location.search);
    const formId = urlParams.get('formId');

    if (!formId) {
        alert('Formulaire non spécifié');
        return;
    }

    fetch(`https://typeformapi.leod1.fr/forms/${formId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${TOKEN}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Connexion à l\'API impossible');
        }
        return response.json();
    })
    .then(data => {
        displayResponses(data);
    })
    .catch(error => {
        console.error('Une erreur est survenue pendant la récupération des données:', error);
    });

    function displayResponses(form) {
        const responseList = document.getElementById('response-list');
        const responseCount = document.getElementById('response-count');

        // Compte total des réponses
        const totalResponses = form.responses.length;

        responseCount.textContent = `Nombre de réponses : ${totalResponses}`;

        if (form.questions && form.questions.length > 0) {
            form.questions.forEach(question => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('card-content');

                const questionTitle = document.createElement('h3');
                questionTitle.classList.add('body-m');
                questionTitle.textContent = question.question_text;
                questionDiv.appendChild(questionTitle);

                const responseListElem = document.createElement('ul');
                responseListElem.classList.add('response-list');

                if (question.question_type === 'single_choice' || question.question_type === 'multiple_choice') {
                    const responseCounts = {};

                    if (form.responses && form.responses.length > 0) {
                        form.responses.forEach(response => {
                            const answer = response.answers.find(a => a.question_id === question.question_id);

                            if (answer) {
                                if (Array.isArray(answer.answer)) {
                                    answer.answer.forEach(ans => {
                                        if (!responseCounts[ans]) {
                                            responseCounts[ans] = 0;
                                        }
                                        responseCounts[ans]++;
                                    });
                                } else {
                                    if (!responseCounts[answer.answer]) {
                                        responseCounts[answer.answer] = 0;
                                    }
                                    responseCounts[answer.answer]++;
                                }
                            }
                        });
                    }

                    for (let answerText in responseCounts) {
                        const count = responseCounts[answerText];
                        const percentage = ((count / totalResponses) * 100).toFixed(2);

                        const responseText = document.createElement('li');
                        responseText.classList.add('response-list-item', 'body-xs');

                        const responseBarContainer = document.createElement('div');
                        responseBarContainer.classList.add('response-bar-container');

                        const responseBar = document.createElement('div');
                        responseBar.classList.add('response-bar');
                        responseBar.style.width = `${percentage}%`;
                        responseBar.textContent = `${percentage}% (${count} réponses)`;

                        responseText.textContent = `${answerText} - `;
                        responseText.appendChild(responseBarContainer);
                        responseBarContainer.appendChild(responseBar);
                        responseListElem.appendChild(responseText);
                    }
                } else if (question.question_type === 'free_text') {
                    if (form.responses && form.responses.length > 0) {
                        form.responses.forEach(response => {
                            const answer = response.answers.find(a => a.question_id === question.question_id);

                            if (answer) {
                                const responseText = document.createElement('li');
                                responseText.classList.add('response-list-item', 'body-xs');
                                responseText.textContent = answer.answer;
                                responseListElem.appendChild(responseText);
                            }
                        });
                    }
                }

                questionDiv.appendChild(responseListElem);
                responseList.appendChild(questionDiv);
            });
        }
    }

    function exportCSV() {
        fetch(`https://typeformapi.leod1.fr/forms/${formId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let csvContent = "data:text/csv;charset=utf-8,";
            if (data.questions && data.questions.length > 0) {
                data.questions.forEach(question => {
                    csvContent += `${question.question_text},`;
                });
                csvContent += "\n";

                if (data.responses && data.responses.length > 0) {
                    data.responses.forEach(response => {
                        response.answers.forEach(answer => {
                            csvContent += `${answer.answer},`;
                        });
                        csvContent += "\n";
                    });
                }
            }

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "responses.csv");
            document.body.appendChild(link);
            link.click();
        })
        .catch(error => console.error('Erreur lors de l\'exportation en CSV:', error));
    }

    function exportPDF() {
        // Logique pour exporter en PDF
    }

    function exportXLSX() {
        // Logique pour exporter en XLSX
    }
});