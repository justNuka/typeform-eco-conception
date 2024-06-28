document.addEventListener("DOMContentLoaded", () => {
  function getFormIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id_form");
  }

  const formId = getFormIdFromUrl();
  if (!formId) {
    console.error("ID du formulaire manquant dans l'URL");
    return;
  }

  fetch(`https://typeformapi.leod1.fr/forms/${formId}`, {
    method: "GET",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Connexion à l'API impossible");
      }
      return response.json();
    })
    .then((data) => {
      displayResponses(data);
    })
    .catch((error) => {
      console.error(
        "Une erreur est survenue pendant la récupération des données:",
        error
      );
    });

  function displayResponses(data) {
    const contentDiv = document.getElementById("content");

    const formTitle = document.createElement("h1");
    formTitle.textContent = data.form_title;
    formTitle.classList.add("title-l");
    contentDiv.appendChild(formTitle);

    data.questions.forEach((question) => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      const itemName = document.createElement("label");
      itemName.textContent = question.question_text;
      itemName.classList.add("body-accent-m", "question");
      itemDiv.appendChild(itemName);

      if (question.question_type === "free_text") {
        const itemInput = document.createElement("input");
        itemInput.type = "text";
        itemInput.classList.add("input");
        itemInput.placeholder = "Entrez votre réponse";
        itemInput.name = `question_${question.question_id}`;
        itemDiv.appendChild(itemInput);
      } else if (
        question.question_type === "single_choice" ||
        question.question_type === "multiple_choice"
      ) {
        question.options.forEach((option) => {
          const divOption = document.createElement("div");
          const inputOption = document.createElement("input");
          divOption.classList.add("div-radio");
          inputOption.type =
            question.question_type === "single_choice" ? "radio" : "checkbox";
          inputOption.value = option;
          inputOption.name = `question_${question.question_id}`;
          const textRadio = document.createElement("p");
          textRadio.textContent = option;
          divOption.appendChild(inputOption);
          divOption.appendChild(textRadio);
          itemDiv.appendChild(divOption);
        });
      }
      contentDiv.appendChild(itemDiv);
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Envoyer le formulaire";
    submitButton.classList.add("btn-primary");
    contentDiv.appendChild(submitButton);
  }
});

document.getElementById("content").addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(this);
  const results = [];

  formData.forEach((value, key) => {
    const [prefix, questionId] = key.split("_");
    const existingAnswer = results.find(
      (result) => result.question_id === questionId
    );

    if (existingAnswer) {
      if (Array.isArray(existingAnswer.answer)) {
        existingAnswer.answer.push(value);
      } else {
        existingAnswer.answer = [existingAnswer.answer, value];
      }
    } else {
      results.push({
        question_id: questionId,
        answer: value,
      });
    }
  });

  const dataToSend = {
    responses: results,
  };

  fetch(`https://typeformapi.leod1.fr/forms/${formId}/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataToSend),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi des données");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Réponse enregistrée avec succès:", data);
      const redirectUrl = `${window.location.origin}/login-register/login-register.html`;
      window.location.href = redirectUrl;
    })
    .catch((error) => {
      console.error("Une erreur est survenue:", error);
    });
});
