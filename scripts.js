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

let curPlayer = 0;

let players = [

   
]



let answerButtons = document.getElementsByClassName("answer");

let progressBar = document.getElementsByClassName("progress-bar")[0];



let nextBtn = {
  btn: tmpBtn,
  setNext: function (i) {
   
    this.btn.setAttribute("onclick", 'nextPlayer('+i+')');
    this.btn.setAttribute("class", "next ");
    this.btn.innerHTML = "<h3>Next</h3>";
  },
  setReset: function () {
   
    this.btn.setAttribute("onclick", "reloadPage()");
    this.btn.setAttribute("class", "reset ");
    this.btn.innerHTML = "<h3>Reset</h3>";
  },
};
function reloadPage(){ window.scroll({
  top:0,
  left: 0,
  behavior: "smooth",
}); 

setTimeout(()=>{
window.location.reload();
},1000)
}


let config = {
    difficulty:"random",
    category:0,
    numQuestions:50,
    url:"https://opentdb.com/api.php?",
    request:function(){
        return this.url+'amount='+this.numQuestions+""+(this.category==0?"":"&category="+this.category)+""+(this.difficulty=="random"?"":"&difficulty="+this.difficulty)+"&type=multiple"
    },
    setCategory:function(id){
        this.category = id;
        //document.getElementById("carouselExample").classList.add('d-none');
        preGame(this.category);
        document.getElementById("preGame").scrollIntoView()
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
function nextPlayer(questionId){
  console.log(curPlayer)
  if(curPlayer == players.length-1){
    curPlayer=0;
    players[0].printQ(questionId+1);
  }else{
    curPlayer++;
    console.log("next player",curPlayer)
    players[curPlayer].printQ(questionId+1);
  }
}
function createElement(element,classArray,value){
  let item = document.createElement(element);
  item.innerHTML = value;
  item.classList.add(...classArray)
  return item;
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
  let nav = document.getElementsByClassName("categories")[0]
let k = 0;
  for (let i = 0; i < categories.length/7; i++) {
    let item = document.createElement('div');
    let ul = document.createElement("ul")
    
    item.classList.add("carousel-item")

    i==0?item.classList.add("active"):"";
    for (let j = 0; j < 7; j++) {
        item.appendChild(newCategoryElement(categories[k].name, categories[k].id));
        ul.appendChild(createElement("li",["cat-item"],`<a  onclick="config.setCategory(${categories[k].id})"> ${categories[k].name}</a>`))
        k++;
        
    }
    nav.appendChild(createElement("div",["list-container"],"").appendChild(ul))
    document.getElementById("categories").appendChild(item);

    
  }
}





async function getNews(){ 
  let response = await fetch("https://inshorts.deta.dev/news?category=technology");
  let json = await response.json();
  let data = json.data;
  let newsItems = document.getElementsByClassName("news-entry")
  console.log(newsItems.length)
  for (let i=0; i<newsItems.length;i++) {
     console.log(data[i].imageUrl);
     newsItems[i].style.backgroundImage = `url(" ${data[i].imageUrl}")`;
     newsItems[i].addEventListener("click",()=>{window.open(data[i].readMoreUrl, '_blank').focus();})
     newsItems[i].children[0].innerHTML = data[i].title
  }
  
}

function init() {
  getCategories();
  getNews();
}


init();

function preGame(id){
    console.log("break");
    document.getElementById("preGame").classList.add('d-block')
    document.getElementById("preGame").classList.remove('d-none')
    for (const i of categories) {
        if(i.id == id){
            document.getElementById("preImg").setAttribute("src",`https://source.unsplash.com/random/180x150/?${i.name}`)
            document.getElementById("catLabel").innerHTML = i.name
        }
        
    }
}
function displayAnswers(question, questionId){
  let correctIndex = Math.floor(
    Math.random() * question.incorrect_answers.length
  );

  let answerArray = question.incorrect_answers;
  answerArray.splice(correctIndex, 0, question.correct_answer);

  for (let j = 0; j < question.incorrect_answers.length; j++) {
    if (j == correctIndex) {
      newCorrectAnswer(question.correct_answer, questionId, j);
    } else {
      newWrongAnswer(question.incorrect_answers[j], questionId, j);
    }
  }
}






async function initPlayers(){
  for (let i = 0; i < 3; i++) {
      let playerNum = i+1
      players.push({playerId:i,
          name:"Player"+playerNum,
          questions: await fetchQuestions(i),
          score:0,
          printQ: function(questionId) {
  
            nextBtn.setReset();
          //display question and category
          
          if (questionId == this.questions.length ) {
            questionContainer.innerHTML =
              "<h3>Thanks for playing!! Your Score was: " + score + " out of "+config.numQuestions+"</h3>";
          } else {
            document.getElementById("score").innerHTML = players[curPlayer].name+"'s score:"+players[curPlayer].score;
            updateProgress(questionId);
            resetAnswers();
            questionContainer.classList.remove(...["bg-danger","bg-succes"]);
            setDifficulty(this.questions[questionId].difficulty);
            let curQuestionObj = this.questions[questionId];
            let categoryDisplay = document.getElementsByClassName("category")[0];
            questionDisplay.innerHTML = curQuestionObj.question;
            categoryDisplay.innerHTML = curQuestionObj.category;
            // categoryBtn.innerHTML =
            //   "<p>Category: " + curQuestionObj.category + "</p>";
          
            //display answers
            displayAnswers(curQuestionObj,questionId)
            
          }
          }}


          
      );
      
  }
  console.log(players)
}

function quickStart(){
  config.category =0;
  document.getElementsByClassName('gameContainer')[0].classList.remove('d-none')
  document.getElementsByClassName('gameContainer')[0].classList.add('d-block')
  answerContainer.scrollIntoView();
   
    fetchQuestions();

}
function setDifficulty(dif) {
  config.difficulty = dif;
let difficultyBtn = document.getElementById("difficultyMenuButton");

  switch (config.difficulty) {
    case "easy":
      gameHeader.classList.remove(...["bg-succsess","bg-danger"]);
      gameHeader.classList.add("bg-success");

      progressBar.classList.remove(...["bg-succsess","bg-danger"]);
      progressBar.classList.add("bg-success");

      difficultyBtn.classList.remove(...["bg-warning","bg-danger"]);
      difficultyBtn.classList.add("bg-success");

    
      break;

    case "medium":

      gameHeader.classList.remove(...["bg-succsess","bg-danger"]);
      gameHeader.classList.add("bg-warning");

      progressBar.classList.remove(...["bg-succsess","bg-danger"]);
      progressBar.classList.add("bg-warning");

      difficultyBtn.classList.remove(...["bg-succsess","bg-danger"]);
      difficultyBtn.classList.add("bg-warning");
    //   difficultyBtn.innerHTML = "<p>Difficulty: Medium</p>";
      break;

    case "hard":
      gameHeader.classList.remove(...["bg-succsess","bg-warning"]);
      gameHeader.classList.add("bg-danger");

       progressBar.classList.remove(...["bg-succsess","bg-warning"]);
      progressBar.classList.add("bg-danger");
      
      difficultyBtn.classList.remove(...["bg-succsess","bg-warning"]);
      difficultyBtn.classList.add("bg-danger");
    //   difficultyBtn.innerHTML = "<p>Difficulty: Hard</p>";
      break;
      default:
        gameHeader.classList.remove(...["bg-succsess","bg-warning","bg-danger"]);

       progressBar.classList.remove(...["bg-succsess","bg-warning","bg-danger"]);
     
      
      difficultyBtn.classList.remove(...["bg-succsess","bg-warning","bg-danger"]);
 

  }
}

async function start(){
    await initPlayers();
    console.log("start")
    config.setNumQuestions(document.getElementById("questionNum").value);
    //config.setNumPlayers(document.getElementById("playerNum").value);
    document.getElementsByClassName('gameContainer')[0].classList.remove('d-none')
     document.getElementsByClassName('gameContainer')[0].classList.add('d-block')
     document.getElementById("preGame").classList.add('d-none')
     document.getElementById("preGame").classList.remove('d-block')
    
    players[0].printQ(0)
    


   
}

async function fetchQuestions() {

  console.log(config.request())
let response = await fetch(
  config.request()
);
let questions = await response.json();
  return questions.results

}


function resetAnswers() {
  let answers = document.getElementsByClassName("answer");
  for (let i = 0; i < answers.length; i++) {
    answers[i].innerHTML = '<h3 class="placeholder col-6">';
    answers[i].setAttribute("onclick", "");
  }
 
}






function correctAnswer(questionId) {
  let question = players[curPlayer].questions[questionId] 
  players[curPlayer].score++;

  document.getElementById("score").innerHTML = players[curPlayer].score;
  let i = questionId + 1;
  nextBtn.setNext(i);
  questionContainer.classList.add("bg-success");
  questionDisplay.innerHTML =
    "Correct Answer: " + question.correct_answer;
  resetAnswers();
  // updateProgress(index);
}
function incorrectAnswer(index) {
  let question = players[curPlayer].questions[index] 
  questionContainer.classList.add("bg-danger");
  let i = index + 1;
  questionDisplay.innerHTML =
    "Correct Answer: " + question.correct_answer;
  nextBtn.setNext(i);
  resetAnswers()
  // updateProgress(index);
}

function updateProgress(index) {
  progressBar.setAttribute("style", "width:" + ((index + 1) / config.numQuestions) * 100 + "%");
}

function newWrongAnswer(answer, questionId, index) {
  let btn = answerButtons[index];

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

function runtime(){

}



