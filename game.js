// DOM ELEMENTS

const questionElement = document.getElementById("question");
const choicesElements = Array.from(document.getElementsByClassName("choice-text"));
const progressTextElement = document.getElementById('progress-text');
const scoreElement = document.getElementById('score');
const innerProgressBarElement = document.getElementById('inner-progress-bar');

// VARIABLES

let currentQuestion;
let acceptingAnswers = false;
let score;
let questionCounter;
let availableQuestions;

// CONSTANTS

const correctBonus = 10;
const maxQuestions = 3;

// Fetch API

let questions = [];

fetch("questions.json")
                    .then(response => {
                        return response.json();
                    })
                    .then(loadedQuestions => {
                        questions = loadedQuestions;
                        startGame();
                    })
                    .catch(error => {
                        console.error(error);
                    });

// FUNCTIONS

function startGame() {

    // set variables
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];

    // display a (new) question
    getNewQuestion();
};


function getNewQuestion() {

    // take the user to the end page if there are no more available questions OR the limit has been reached
    if (availableQuestions === 0 || questionCounter >= maxQuestions) {
        // save the score to local storage
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign('/end.html');
    }

    // increment the question counter
    questionCounter++;
    progressTextElement.innerText = `Question ${questionCounter}/${maxQuestions}`

    //update the progress bar
    innerProgressBarElement.style.width = `${(questionCounter / maxQuestions) * 100}%`;

    // display a question at random
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    questionElement.innerText = currentQuestion.question;

    // display the question's choices
    choicesElements.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    // remove the current question from available questions
    availableQuestions.splice(questionIndex, 1);

    // let the user select an answer
    acceptingAnswers = true;
};

function incrementScore(number) {
    score += number
    scoreElement.innerText = score;
}

// EVENT LISTENERS

choicesElements.forEach(choice => {

    choice.addEventListener('click', event => {

        // ignore click action if not accepting answers
        if (!acceptingAnswers) {
            return
        };
        
        // stop accepting answers once the user clicked on a choice
        acceptingAnswers = false;

        // check that the answer is correct
        const selectedChoice = event.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        // apply fitting HTML class
        selectedChoice.parentElement.classList.add(classToApply);

        //increment score
        if (classToApply == 'correct') {
            incrementScore(correctBonus);
        };

        // remove class and load next question after 1s
        setTimeout( () => {

            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();

        }, 1000);
    });
});