document.addEventListener('DOMContentLoaded', () => {
    const questionsContainer = document.getElementById('questionsContainer');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const validateFormBtn = document.getElementById('validateFormBtn');
    const questionTemplate = document.getElementById('questionTemplate').content;

    addQuestionBtn.addEventListener('click', () => {
        const newQuestion = document.importNode(questionTemplate, true);
        questionsContainer.appendChild(newQuestion);
        addEventListeners(questionsContainer.lastElementChild);
    });

    validateFormBtn.addEventListener('click', () => {
        if (!validateForm()) {
            return;
        }
        const formTitle = document.getElementById('formTitle').value;
        const questions = document.querySelectorAll('.question');
        
        const formObject = {
            form_id: "0",
            form_title: formTitle,
            questions: [],
            responses: []
        };

        questions.forEach((questionElement, index) => {
            const questionTitle = questionElement.querySelector('.question-title').value;
            const questionType = questionElement.querySelector('.question-type').value;
            const options = questionElement.querySelectorAll('.option');
            const questionObject = {
                question_id: (index + 1).toString(),
                question_type: questionType === 'text' ? 'free_text' : (questionType === 'single' ? 'single_choice' : 'multiple_choice'),
                question_text: questionTitle,
                options: [],
                correct_answer: null,
                correct_answers: []
            };

            options.forEach(option => {
                const optionInput = option.querySelector('.option-input').value;
                const correctAnswerInput = option.querySelector('.correct-answer');

                questionObject.options.push(optionInput);
                
                if (correctAnswerInput.type === 'checkbox' && correctAnswerInput.checked) {
                    questionObject.correct_answers.push(optionInput);
                } else if (correctAnswerInput.type === 'radio' && correctAnswerInput.checked) {
                    questionObject.correct_answer = optionInput;
                }
            });

            formObject.questions.push(questionObject);
        });
        console.log(JSON.stringify(formObject, null, 2));
    });

    function addEventListeners(questionElement) {
        const removeQuestionBtn = questionElement.querySelector('.remove-question');
        const addOptionBtn = questionElement.querySelector('.add-option');
        const optionsContainer = questionElement.querySelector('.options-container');
        const questionTypeSelect = questionElement.querySelector('.question-type');

        removeQuestionBtn.addEventListener('click', () => {
            questionElement.remove();
        });

        addOptionBtn.addEventListener('click', () => {
            addOption(questionElement, questionTypeSelect.value);
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
        });

        const existingOptions = questionElement.querySelectorAll('.option .remove-option');
        existingOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.target.closest('.option').remove();
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
                <input type="radio" class="correct-answer input" disabled>
                <input type="text" class="option-input input" placeholder="Nouvelle option">
                <button class="remove-option">X</button>
            `;
        } else if (questionType === 'multiple') {
            optionTemplate.innerHTML = `
                <input type="checkbox" class="correct-answer input" disabled>
                <input type="text" class="option-input input" placeholder="Nouvelle option">
                <button class="remove-option">X</button>
            `;
        }

        optionsContainer.insertBefore(optionTemplate, addOptionBtn);
        optionTemplate.querySelector('.remove-option').addEventListener('click', () => {
            optionTemplate.remove();
        });
    }
    function validateForm() {
        const formTitle = document.getElementById('formTitle').value.trim();
        if (formTitle === '') {
            alert("Veuillez saisir un titre pour le formulaire.");
            return false;
        }
    
        const questions = document.querySelectorAll('.question');
        if (questions.length === 0) {
            alert("Veuillez ajouter au moins une question.");
            return false;
        }
    
        let isValid = true;
    
        questions.forEach((questionElement, index) => {
            const questionTitle = questionElement.querySelector('.question-title').value.trim();
            if (questionTitle === '') {
                alert(`La question ${index + 1} n'a pas de titre.`);
                isValid = false;
                return;
            }
    
            const questionType = questionElement.querySelector('.question-type').value;
            const options = questionElement.querySelectorAll('.option');
            let hasCorrectAnswer = false;
    
            options.forEach(option => {
                const optionInput = option.querySelector('.option-input').value.trim();
                const correctAnswerInput = option.querySelector('.correct-answer');
    
                if (optionInput !== '') {
                    if (correctAnswerInput.checked) {
                        hasCorrectAnswer = true;
                    }
                } else {
                    alert(`La question ${index + 1} a un titre d'option vide.`);
                    isValid = false;
                    return;
                }
            });
        });
    
        return isValid;
    }
    
});
