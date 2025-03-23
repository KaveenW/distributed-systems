async function submitQuestion() {
    const question = document.getElementById('question').value;
    const answer1 = document.getElementById('answer1').value;
    const answer2 = document.getElementById('answer2').value;
    const answer3 = document.getElementById('answer3').value;
    const answer4 = document.getElementById('answer4').value;
    
    const answers = [
        { text: answer1, isCorrect: false },
        { text: answer2, isCorrect: false },
        { text: answer3, isCorrect: false },
        { text: answer4, isCorrect: false }
    ];

    const correctIndex = parseInt(document.getElementById('isCorrect').value);
    answers[correctIndex].isCorrect = true;

    const category = document.getElementById('category').value;
    const newCategory = document.getElementById('newCategory').value;

    // If a new category is provided, use it. Otherwise, use the selected category
    const finalCategory = newCategory ? newCategory : category;

    // Validate that all fields are filled
    if (!question || !answer1 || !answer2 || !answer3 || !answer4 || !finalCategory) {
        alert('Please fill in all fields before submitting.');
        return;
    }

    await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answers, category: finalCategory })
    });

    alert("Question Submitted!");
    // Optionally, clear the fields after submission
    document.getElementById('question').value = '';
    document.getElementById('answer1').value = '';
    document.getElementById('answer2').value = '';
    document.getElementById('answer3').value = '';
    document.getElementById('answer4').value = '';
    document.getElementById('category').value = '';
    document.getElementById('newCategory').value = '';
}
