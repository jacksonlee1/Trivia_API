let questionArray = [];
let score = 0;
let questionContainer = document.getElementsByClassName("current-question")[0];
let questionDisplay = document.getElementsByClassName("question")[0];
let gameHeader = document.getElementById("header");
let answerContainer = document.getElementsByClassName("answers")[0];
//let categoryDropdown = document.getElementsByClassName("cat-dropdown")[0];
let difficultyDropdown = document.getElementsByClassName("dif-dropdown")[0];
let tmpBtn = document.getElementById("utilButton");
let categories = [];

let nextBtn = {
  btn: tmpBtn,
  setNext: function (i) {
    this.btn.setAttribute("onclick", "printQ(" + i + ")");
    this.btn.setAttribute("class", "next ");
    this.btn.innerHTML = "<h3>Next</h3>";
  },
  setReset: function () {
    this.btn.setAttribute("onclick", "window.location.reload()");
    this.btn.setAttribute("class", "reset ");
    this.btn.innerHTML = "<h3>Reset</h3>";
  },
};

let config = {
    difficulty:"random",
    category:0,
    numQuestions:50,
    url:"https://opentdb.com/api.php?",
    request:function(){
        return this.url+'amount='+this.numQuestions+""+(this.category==0?"":"&category="+this.category)+""+(this.difficulty=="random"?"":"&difficulty="+this.difficulty)
    },
    setCategory:function(id){
        this.category = id;
        //document.getElementById("carouselExample").classList.add('d-none');
        preGame(this.category);
        // document.getElementsByClassName('gameContainer')[0].classList.remove('d-none')
        // document.getElementsByClassName('gameContainer')[0].classList.add('d-block')
    },
    setNumQuestions:function(num){
        this.numQuestions= num;
    },
    numPlayers:1,
    setNumPlayers:function(num){
        this.numPlayers = num
    }


}
function preGame(id){
    
    document.getElementById("preGame").classList.add('d-block')
    document.getElementById("preGame").classList.remove('d-none')
    for (const i of categories) {
        if(i.id == id){
            document.getElementById("preImg").setAttribute("src",`https://source.unsplash.com/random/180x150/?${i.name}`)
            document.getElementById("catLabel").innerHTML = i.name
        }
        
    }
}

let curPlayer = 0;

let players = [
   
]



let answerButtons = document.getElementsByClassName("answer");

let progressBar = document.getElementsByClassName("progress-bar")[0];

init();
function init() {
  getCategories();
}
function start(){
    config.setNumQuestions(document.getElementById("questionNum").value);
    //config.setNumPlayers(document.getElementById("playerNum").value);
    document.getElementsByClassName('gameContainer')[0].classList.remove('d-none')
     document.getElementsByClassName('gameContainer')[0].classList.add('d-block')
     document.getElementById("preGame").classList.add('d-none')
     document.getElementById("preGame").classList.remove('d-block')
   
    fetchQuestions()
   
}
function initPlayers(){
    for (let i = 0; i < array.length; i++) {
        let playerNum = i+1
        players.add({playerId:i,
            name:"Player"+playerNum,
            questions:[],
            score:0
        });
        
    }
}
function setDifficulty(dif) {
  config.difficulty = dif;
let difficultyBtn = document.getElementById("difficultyMenuButton");

  switch (config.difficulty) {
    case "easy":
      gameHeader.classList.remove("bg-warning");
      gameHeader.classList.remove("bg-danger");
      gameHeader.classList.add("bg-success");

      progressBar.classList.remove("bg-warning");
      progressBar.classList.remove("bg-danger");
      progressBar.classList.add("bg-success");

      difficultyBtn.classList.remove("bg-warning");
      difficultyBtn.classList.remove("bg-danger");
      difficultyBtn.classList.add("bg-success");

    
      break;

    case "medium":
      gameHeader.classList.remove("bg-succsess");

      gameHeader.classList.remove("bg-danger");
      gameHeader.classList.add("bg-warning");

      progressBar.classList.remove("bg-succsess");
      progressBar.classList.remove("bg-danger");
      progressBar.classList.add("bg-warning");

      difficultyBtn.classList.remove("bg-succsess");
      difficultyBtn.classList.remove("bg-danger");
      difficultyBtn.classList.add("bg-warning");
    //   difficultyBtn.innerHTML = "<p>Difficulty: Medium</p>";
      break;

    case "hard":
      gameHeader.classList.remove("bg-succsess");
      gameHeader.classList.remove("bg-warning");
      gameHeader.classList.add("bg-danger");

       progressBar.classList.remove("bg-succsess");
      progressBar.classList.remove("bg-warning");
      progressBar.classList.add("bg-danger");
      
      difficultyBtn.classList.remove("bg-succsess");
      difficultyBtn.classList.remove("bg-warning");
      difficultyBtn.classList.add("bg-danger");
    //   difficultyBtn.innerHTML = "<p>Difficulty: Hard</p>";
      break;
      default:
        gameHeader.classList.remove("bg-succsess");
      gameHeader.classList.remove("bg-warning");
      gameHeader.classList.remove("bg-danger");

       progressBar.classList.remove("bg-succsess");
      progressBar.classList.remove("bg-danger");
      progressBar.classList.remove("bg-warning");
      
      difficultyBtn.classList.remove("bg-succsess");
      difficultyBtn.classList.remove("bg-danger");
      difficultyBtn.classList.remove("bg-warning");

  }
}
function resetAnswers() {
  let answers = document.getElementsByClassName("answer");
  for (let i = 0; i < answers.length; i++) {
    answers[i].innerHTML = '<h3 class="placeholder col-6">';
    answers[i].setAttribute("onclick", "");
  }
}

async function fetchQuestions() {

    console.log(config.request())
  let response = await fetch(
    config.request()
  );
  let questions = await response.json();
  questionArray = questions.results;

  printQ(0);
}

function newCategoryElement(label, id) {
  let div = document.createElement("div");
 
  
  div.setAttribute("onclick", `config.setCategory(${id})` );
  div.classList.add("cat")
  div.innerHTML=`<img src="https://source.unsplash.com/random/180x150/?${label}" alt="">
  <h5>${label}</h5>`
  
  return div;
}

// get categories: https://opentdb.com/api_category.php

async function getCategories() {
  let response = await fetch("https://opentdb.com/api_category.php");
  let list = await response.json();
  categories = list.trivia_categories;
let k = 0;
  for (let i = 0; i < categories.length/7; i++) {
    let item = document.createElement('div');
    let nav = document.getElementsByClassName("categories")[0]
    item.classList.add("carousel-item")
    i==0?item.classList.add("active"):"";
    for (let j = 0; j < 7; j++) {
        item.appendChild(newCategoryElement(categories[k].name, categories[k].id));
        nav.appendChild(createTextChild("li",`<a onclick="config.setCategory(${categories[k].id})"> ${categories[k].name}</a>`))
        k++;
        
    }
    document.getElementById("categories").appendChild(item);

    
  }
}
function createOnclickLinkChild(href){
  let item = document.createElement("a");
  item.setAttribute("onclick", href);
  return item;
}





function correctAnswer(questionId) {
 score++;
  resetAnswers();
  document.getElementById("score").innerHTML = score;
  let i = questionId + 1;
  nextBtn.setNext(i);
  questionContainer.classList.add("bg-success");
  questionDisplay.innerHTML =
    "Correct Answer: " + questionArray[questionId].correct_answer;
  resetAnswers();
  // updateProgress(index);
}
function incorrectAnswer(index) {
  questionContainer.classList.add("bg-danger");
  let i = index + 1;
  questionDisplay.innerHTML =
    "Correct Answer: " + questionArray[index].correct_answer;
  nextBtn.setNext(i);
  resetAnswers();

  // updateProgress(index);
}

function updateProgress(index) {
  progressBar.setAttribute("style", "width:" + ((index + 1) / config.numQuestions) * 100 + "%");
}

function newWrongAnswer(answer, questionId, index) {
  let btn = document.getElementsByClassName("answer")[index];

  btn.innerHTML = `<h3>${answer}</h3>`;
  btn.setAttribute("onclick", "incorrectAnswer(" + questionId + ")");
  return btn;
}

function newCorrectAnswer(answer, questionId, index) {
  let btn = document.getElementsByClassName("answer")[index];

  btn.innerHTML = `<h3>${answer}</h3>`;
  btn.setAttribute("onclick", "correctAnswer(" + questionId + ")");
  return btn;
}

function printQ(questionId) {
    nextBtn.setReset();
  //display question and category

  if (questionId == questionArray.length ) {
    questionContainer.innerHTML =
      "<h3>Thanks for playing!! Your Score was: " + score + " out of "+config.numQuestions+"</h3>";
  } else {
    updateProgress(questionId);
    resetAnswers();
    
    setDifficulty(questionArray[questionId].difficulty)
    let curQuestionObj = questionArray[questionId];

    questionContainer.classList.remove("bg-danger");
    questionContainer.classList.remove("bg-success");
    //let categoryBtn = document.getElementById("categoryMenuButton");

    let categoryDisplay = document.getElementsByClassName("category")[0];
    questionDisplay.innerHTML = curQuestionObj.question;
    categoryDisplay.innerHTML = curQuestionObj.category;
    // categoryBtn.innerHTML =
    //   "<p>Category: " + curQuestionObj.category + "</p>";

    //display answers

    let correctIndex = Math.floor(
      Math.random() * curQuestionObj.incorrect_answers.length
    );

    let answerArray = curQuestionObj.incorrect_answers;
    answerArray.splice(correctIndex, 0, curQuestionObj.correct_answer);

    for (let j = 0; j < curQuestionObj.incorrect_answers.length; j++) {
      if (j == correctIndex) {
        newCorrectAnswer(curQuestionObj.correct_answer, questionId, j);
      } else {
        newWrongAnswer(curQuestionObj.incorrect_answers[j], questionId, j);
      }
    }
  }
}

function createTextChild(element, value){
  let item = document.createElement(element);
  item.innerHTML = value;
  return item;
}


