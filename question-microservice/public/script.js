// Function to fetch categories and populate the dropdown
async function fetchCategories() {
    const response = await fetch('/categories');
    const categories = await response.json();
    const categoryDropdown = document.getElementById('category');

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.name;
        option.textContent = cat.name;
        categoryDropdown.appendChild(option);
    });
}

// Function to fetch questions based on selected category and count
async function fetchQuestions() {
    const category = document.getElementById('category').value;
    const count = document.getElementById('question-count').value;

    const response = await fetch(`/question/${category}?count=${count}`);
    const questionData = await response.json();

    const questionArea = document.getElementById('question-area');
    questionArea.innerHTML = ''; // Clear previous questions

    // Loop through and display all the questions
    questionData.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question-box');
        questionDiv.innerHTML = `<h3>Question ${index + 1}: ${question.question}</h3>`;

        // Display answers for each question
        question.answers.forEach(answer => {
            const btn = document.createElement('button');
            btn.textContent = answer.text;
            btn.onclick = () => {
                if (answer.isCorrect) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('wrong');
                }
                // Disable all buttons after an answer is selected
                questionDiv.querySelectorAll('button').forEach(b => b.disabled = true);
            };
            questionDiv.appendChild(btn);
        });

        questionArea.appendChild(questionDiv);
    });
}

window.onload = fetchCategories;
