document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const validateFormBtn = document.getElementById('validateFormBtn');
    const questionTemplate = document.getElementById('questionTemplate').content;
    const formTitleInput = document.getElementById('formTitle');

    addQuestionBtn.addEventListener('click', () => {
        const newQuestion = document.importNode(questionTemplate, true);
        questionsContainer.appendChild(newQuestion);
        addEventListeners(questionsContainer.lastElementChild);
        checkFormValidity();
    });

    validateFormBtn.addEventListener('click', () => {
        const formTitle = formTitleInput.value;
        const questions = document.querySelectorAll('.question');
        
        const formObject = {
            form_title: formTitle,
            questions: [],
        };

        questions.forEach((questionElement) => {
            const questionTitle = questionElement.querySelector('.question-title').value;
            const questionType = questionElement.querySelector('.question-type').value;
            const options = questionElement.querySelectorAll('.option');
            const questionObject = {
                question_type: questionType === 'text' ? 'free_text' : (questionType === 'single' ? 'single_choice' : 'multiple_choice'),
                question_text: questionTitle,
                options: [],
                correct_answer: null,
                correct_answers: []
            };

            options.forEach(option => {
                const optionInput = option.querySelector('.option-input').value;
                const correctAnswerInput = option.querySelector('.correct-answer');

                if (optionInput) {
                    questionObject.options.push(optionInput);
                    
                    if (correctAnswerInput.type === 'checkbox' && correctAnswerInput.checked) {
                        questionObject.correct_answers.push(optionInput);
                    } else if (correctAnswerInput.type === 'radio' && correctAnswerInput.checked) {
                        questionObject.correct_answer = optionInput;
                    }
                }
            });

            formObject.questions.push(questionObject);
        });

        const TOKEN = localStorage.getItem('jwt');
        fetch('https://typeformapi.leod1.fr/forms', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formObject)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            window.location.href = '../list-form/list-form.html';
        })
        .catch(error => {
            console.error('Une erreur est survenue pendant la récupération des données:', error);
            alert('Erreur lors de la création du formulaire: ' + error.message);
        });

    });

    formTitleInput.addEventListener('input', checkFormValidity);

    function addEventListeners(questionElement) {
        const removeQuestionBtn = questionElement.querySelector('.remove-question');
        const addOptionBtn = questionElement.querySelector('.add-option');
        const optionsContainer = questionElement.querySelector('.options-container');
        const questionTypeSelect = questionElement.querySelector('.question-type');
        const inputs = questionElement.querySelectorAll('input, select');

        removeQuestionBtn.addEventListener('click', () => {
            questionElement.remove();
            checkFormValidity();
        });

        addOptionBtn.addEventListener('click', () => {
            addOption(questionElement, questionTypeSelect.value);
            checkFormValidity();
        });

        questionTypeSelect.addEventListener('change', () => {
            const questionType = questionTypeSelect.value;
            optionsContainer.innerHTML = '';
            if (questionType === 'text') {
                optionsContainer.style.display = 'none';
            } else {
                optionsContainer.style.display = 'block';
                addOptionBtn.textContent = (questionType === 'single') ? 'Ajouter une option de réponse unique' : 'Ajouter une option';
                optionsContainer.appendChild(addOptionBtn);
                addOption(questionElement, questionType);
            }
            checkFormValidity();
        });

        inputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
        });

        const existingOptions = questionElement.querySelectorAll('.option .remove-option');
        existingOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.target.closest('.option').remove();
                checkFormValidity();
            });
        });
    }

    function addOption(questionElement, questionType) {
        const optionsContainer = questionElement.querySelector('.options-container');
        const addOptionBtn = questionElement.querySelector('.add-option');
        const optionTemplate = document.createElement('div');
        optionTemplate.classList.add('option');

        if (questionType === 'single') {
            const uniqueName = `single-choice-${Date.now()}`;
            const radioInputs = optionsContainer.querySelectorAll('input[type="radio"]');
            radioInputs.forEach(input => input.name = uniqueName);
            optionTemplate.innerHTML = `
                <input type="radio" class="correct-answer input" name="${uniqueName}">
                <input type="text" class="option-input input" placeholder="Nouvelle option">
                <button class="remove-option">X</button>
            `;
        } else if (questionType === 'multiple') {
            optionTemplate.innerHTML = `
                <input type="checkbox" class="correct-answer input">
                <input type="text" class="option-input input" placeholder="Nouvelle option">
                <button class="remove-option">X</button>
            `;
        }

        optionsContainer.insertBefore(optionTemplate, addOptionBtn);
        optionTemplate.querySelector('.remove-option').addEventListener('click', () => {
            optionTemplate.remove();
            checkFormValidity();
        });
        optionTemplate.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', checkFormValidity);
        });
    }

    function validateForm() {
        const formTitle = formTitleInput.value.trim();
        if (formTitle === '') {
            return false;
        }
    
        const questions = document.querySelectorAll('.question');
        if (questions.length === 0) {
            return false;
        }
    
        let isValid = true;
    
        questions.forEach((questionElement, index) => {
            const questionTitle = questionElement.querySelector('.question-title').value.trim();
            if (questionTitle === '') {
                isValid = false;
                return;
            }
    
            const questionType = questionElement.querySelector('.question-type').value;
            const options = questionElement.querySelectorAll('.option');
    
            options.forEach(option => {
                const optionInput = option.querySelector('.option-input').value.trim();
                if (optionInput === '') {
                    isValid = false;
                    return;
                }
            });
        });
    
        return isValid;
    }

    function checkFormValidity() {
        const isValid = validateForm();
        validateFormBtn.disabled = !isValid;
    }

    checkFormValidity();
});
