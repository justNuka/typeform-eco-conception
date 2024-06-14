[
    {
        "id_form": 1,
        "title": "Test form",
        "content": [
            {
                "id": 1,
                "intitule": "Question 1",
                "Description": "Description de la question 1",
                "reponses": [
                    {"id": 1, "text": "Réponse X"},
                    {"id": 2, "text": "Réponse Y"},
                    {"id": 3, "text": "Réponse Z"}
                ],
                "correcteIds": [2], // peut etre null
                "type": "unique", // ou "multiple" ou "texte libre",
                "answers": [
                    {
                        "id_user": 1,
                        "value": "Réponse Y"
                    },
                    {
                        "id_user": 2,
                        "value": "Réponse X"
                    }
                ],
            },
            {
                "id": 2,
                "intitule": "Question 2",
                "reponses": [
                    {"id": 4, "text": "Réponse A"},
                    {"id": 5, "text": "Réponse B"},
                    {"id": 6, "text": "Réponse C"}
                ],
                "correcteIds": [4], // peut etre null
                "type": "unique" // ou "multiple" ou "texte libre"
            }
        ]
    }
]