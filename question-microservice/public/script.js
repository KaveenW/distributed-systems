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

async function fetchQuestion() {
    const category = document.getElementById('category').value;
    const response = await fetch(`/question/${category}`);
    const questionData = await response.json();

    const questionArea = document.getElementById('question-area');
    questionArea.innerHTML = `<h3>${questionData.question}</h3>`;

    questionData.answers.forEach(answer => {
        const btn = document.createElement('button');
        btn.textContent = answer.text;
        btn.onclick = () => alert(answer.isCorrect ? "Correct!" : "Wrong!");
        questionArea.appendChild(btn);
    });
}

window.onload = fetchCategories;
