const startQuizBtn = document.getElementById("startQuizBtn");
// const quizContainer = document.getElementById("quizContainer");
const resultBtn = document.getElementById("resultBtn");

const questionData = document.getElementById("questionData");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const restartQuiz = document.getElementById("restartQuiz");
const submit = document.getElementById("submit");
const resultSummary = document.getElementById("result-summary");

const option1 = document.getElementById("option1");
const option2 = document.getElementById("option2");
const option3 = document.getElementById("option3");
const option4 = document.getElementById("option4");

const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const label3 = document.getElementById("label3");
const label4 = document.getElementById("label4");

let quizData = [];
let currentIndex;
let selected;
let label;
let correct;
let attempted = 0;
let radiosDisabled;
let isSubmitted = false;
let shuffleQuizData;

window.onload = function () {
  loadQuizData();
};

async function loadQuizData() {
  const jsonQuizData = await fetch("quizData.json");
  console.log(jsonQuizData);

  quizData = await jsonQuizData.json();
  console.log(quizData);
}


function shuffleArray(array) {

  let shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i >= 0; i--) {
    let shuffledIndex = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[shuffledIndex]] = [
      shuffledArray[shuffledIndex],
      shuffledArray[i],
    ];
  }

  shuffledArray.forEach((q) => {
    for (let i = q.options.length - 1; i >= 0; i--) {
      let shuffledIndex = Math.floor(Math.random() * (i + 1));
      console.log(shuffledIndex);

      [q.options[i], q.options[shuffledIndex]] = [
        q.options[shuffledIndex],
        q.options[i],
      ];
    }
  });
console.log("fgdgfdgfdgfdg",shuffledArray);
  return shuffledArray;
}


function startQuizFunction(index) {
  console.log(`Crrent dataArrayIndex on NextBtn: ${index}`);
  let a = shuffleQuizData[index];

  questionData.textContent = `${index + 1}. ${a.question}`;

  // for(let i=0; i<4; i++){
  option1.value = a.options[0];
  option2.value = a.options[1];
  option3.value = a.options[2];
  option4.value = a.options[3];

  label1.textContent = a.options[0];
  label2.textContent = a.options[1];
  label3.textContent = a.options[2];
  label4.textContent = a.options[3];

  nextQuestionBtn.style.display = "block";

  if (index == 9) {
    nextQuestionBtn.style.display = "none";
  }

  function handleSubmitMCQs(index) {
    console.log(`Crrent dataArrayIndex on submitBtn: ${index}`);

    attempted++;
    console.log(`Attempted: ${attempted}`);

    selected = document.querySelector('input[name="name1"]:checked');
    console.log(selected);

    let selectedId = selected.id;

    label = document.querySelector(`label[for = "${selectedId}"]`);

    // console.log(selected);
    // console.log(selected.value);
    // console.log(a.answer);

    if (
      selected.value.trim().toLowerCase() ===
      shuffleQuizData[index].answer.trim().toLowerCase()
    ) {
      label.style.color = "green";
      console.log("Yes Answer match");
      correct++;
      console.log(`Correct: ${correct}`);
    } else {
      label.style.color = "red";
      console.log("Not Match");
    }

    submit.style.display = "none";
    radiosDisabled = document.querySelectorAll('input[name="name1"]');
    radiosDisabled.forEach((r) => (r.disabled = true));
    selected.checked = "false";

    isSubmitted = true;
  }

  submit.style.display = "block";

  submit.onclick = () => {
    // fresh check har dafa
    let currentSelected = document.querySelector('input[name="name1"]:checked');

    if (!currentSelected) {
      alert("Please check an option");
      return;
    }

    selected = currentSelected;

    if (index < 9) {
      handleSubmitMCQs(index);
    } else {
      handleSubmitMCQs(index);
      checkResult();
      selected.checked = false;
      if (label) label.style.color = "";
      startQuizFunction(currentIndex);
    }
  };
}

startQuizBtn.addEventListener("click", function () {

  shuffleQuizData = shuffleArray(quizData);
  console.log("after shuffled, Quiz Data Array", quizData);

  console.log("shuffled Quiz Data Array", shuffleQuizData);
  resultSummary.style.display = "none";
  if (selected) { selected.checked = false; }
  if (label) { label.style.color = ""; }
  radiosDisabled = document.querySelectorAll('input[name="name1"]');
  radiosDisabled.forEach((r) => (r.disabled = false));

  correct = 0;
  currentIndex = 0;
  attempted = 0;
  startQuizFunction(currentIndex);
});

restartQuiz.addEventListener("click", function () {

  shuffleQuizData = shuffleArray(quizData);

  resultSummary.style.display = "none";
  if (selected) { selected.checked = false; }
  if (label) { label.style.color = ""; }
  correct = 0;
  currentIndex = 0;
  attempted = 0;
  startQuizFunction(currentIndex);
});
nextQuestionBtn.addEventListener("click", function () {

  let currentSelected = document.querySelector('input[name="name1"]:checked');

  if (!currentSelected) {
    alert("Please select an option first!");
    return;
  }

  if (!isSubmitted) {
    alert("Please submit your answer before moving to next question!");
    return;
  }

  isSubmitted = false;

  if (currentSelected) currentSelected.checked = false;
  if (label) label.style.color = "";
  radiosDisabled = document.querySelectorAll('input[name="name1"]');
  radiosDisabled.forEach((r) => (r.disabled = false));

  startQuizFunction(++currentIndex);
});

resultBtn.addEventListener("click", function () {
  checkResult();

  correct = 0;
  currentIndex = 0;
  attempted = 0;
  if (selected) {selected.checked = false; }
  if (label) {label.style.color = ""; }
  radiosDisabled = document.querySelectorAll('input[name="name1"]');
  radiosDisabled.forEach((r) => (r.disabled = false));

  startQuizFunction(currentIndex);
});

function checkResult() {
  // Display results on screen
  const resultDiv = document.getElementById("result-summary");
  document.getElementById( "total-questions").textContent = `Total Questions: ${quizData.length}`;
  document.getElementById("attempted").textContent = `Attempted: ${attempted}`;
  document.getElementById("correct").textContent = `Correct: ${correct}`;
  document.getElementById("wrong").textContent = `Wrong: ${ attempted - correct}`;
  resultDiv.style.display = "block";
}
