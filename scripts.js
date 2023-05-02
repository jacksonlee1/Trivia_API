let questionArray = []
let score = 0;
let questionContainer = document.getElementsByClassName("current-question")[0];
let questionDisplay = document.getElementsByClassName("question")[0];
let gameHeader = document.getElementById("header");
let answerContainer = document.getElementsByClassName("answers")[0]
let categoryDropdown = document.getElementsByClassName('cat-dropdown')[0]
let difficultyDropdown = document.getElementsByClassName('dif-dropdown')[0];
let tmpBtn = document.getElementById("utilButton")
let nextBtn =  { btn : tmpBtn,
                setNext:function(i){ 
                this.btn.setAttribute("onclick","printQ("+i+")")
                this.btn.setAttribute("class","next ");
                this.btn.innerHTML="<h3>Next</h3>";
            },
            setReset:function(){
                this.btn.setAttribute("onclick","window.location.reload()")
                this.btn.setAttribute("class","reset ");
                this.btn.innerHTML="<h3>Reset</h3>";
            },

};

let answerButtons = document.getElementsByClassName("answer")
let difficulty = "hard";
let progressBar = document.getElementsByClassName("progress-bar")[0]

init();
function init(){
    getCategories();
}
function setDifficulty(dif){
    difficulty = dif;
   let difficultyBtn = document.getElementById("difficultyMenuButton");
   
    switch(difficulty){
        case('easy'):
            
            gameHeader.classList.remove("bg-warning");
            gameHeader.classList.remove("bg-danger");
            gameHeader.classList.add("bg-success");

            progressBar.classList.remove("bg-warning");
            progressBar.classList.remove("bg-danger");
            progressBar.classList.add("bg-success");
            
            difficultyBtn.innerHTML = '<h4>Difficulty: Easy</h4>'

            break;
        
        case('medium'):
            gameHeader.classList.remove("bg-succsess");
            
            gameHeader.classList.remove("bg-danger");
            gameHeader.classList.add("bg-warning");

            progressBar.classList.remove("bg-succsess");
            progressBar.classList.remove("bg-danger");
            progressBar.classList.add("bg-warning");
            difficultyBtn.innerHTML = '<h4>Difficulty: Medium</h4>'
            break;
        
        case('hard'):
            gameHeader.classList.remove("bg-succsess");
            gameHeader.classList.remove("bg-warning");
            gameHeader.classList.add("bg-danger");

            progressBar.classList.remove("bg-succsess");
            progressBar.classList.remove("bg-warning");
            progressBar.classList.add("bg-danger");
            difficultyBtn.innerHTML = '<h4>Difficulty: Hard</h4>'
            break;
        
    }
    
   
}
function resetAnswers(){
    let answers = document.getElementsByClassName('answer') 
    for(let i =0;i< answers.length;i++){
        answers[i].innerHTML = '<h3 class="placeholder col-6">'
        answers[i].setAttribute("onclick","")
    }

}

async function fetchQuestions(categoryId){
  
    let response = await fetch("https://opentdb.com/api.php?amount=10&category="+categoryId+"&difficulty="+difficulty);
    let questions = await response.json();
    questionArray = questions.results;
   
    printQ(0);
    
}

function newDropdownElement(label,id){
    let liElement = document.createElement("li");
    let aElement = document.createElement("a");
    aElement.setAttribute("class","dropdown-item");
    aElement.innerHTML= label;
    aElement.setAttribute("onclick","fetchQuestions("+id+")");
    liElement.appendChild(aElement)
    return liElement;
}

// get categories: https://opentdb.com/api_category.php

async function getCategories(){
    let response = await fetch("https://opentdb.com/api_category.php");
    let list = await response.json();
    let categories = list.trivia_categories;
   
    
    for(let i =0; i<categories.length; i++){
        let li = newDropdownElement(categories[i].name,categories[i].id)
         document.getElementById("dropdown").appendChild(li)
    }
}
function correctAnswer(questionId){
    score++;
    resetAnswers();
    document.getElementById('score').innerHTML=score;
    let i = questionId+1
    nextBtn.setNext(i);
    questionContainer.classList.add("bg-success");
    questionDisplay.innerHTML = "Correct Answer: "+questionArray[questionId].correct_answer;
    resetAnswers();
    // updateProgress(index);
    
   
}
function incorrectAnswer(index){
    
    questionContainer.classList.add("bg-danger");
    let i = index+1;
    questionDisplay.innerHTML = "Correct Answer: "+questionArray[index].correct_answer;
    nextBtn.setNext(i)
    resetAnswers();
  
    // updateProgress(index);

}

function updateProgress(index){
    
    progressBar.setAttribute("style","width:"+((index+1)/10*100)+"%")
}



function newWrongAnswer(answer,questionId,index){
    let btn = document.getElementsByClassName("answer")[index];
   
    btn.innerHTML = `<h3>${answer}</h3>`;
    btn.setAttribute("onclick","incorrectAnswer("+questionId+")");
    return btn;
}

function newCorrectAnswer(answer,questionId,index){
    let btn = document.getElementsByClassName("answer")[index];
  
    btn.innerHTML = `<h3>${answer}</h3>`;
    btn.setAttribute("onclick","correctAnswer("+questionId+")");
    return btn;
}


function printQ(questionId){
    updateProgress(questionId);
    resetAnswers();
    nextBtn.setReset();
    //display question and category
    
    if(questionId==questionArray.length-1){
        questionContainer.innerHTML = "<h3>Thanks for playing!! Your Score was:"+score+"</h3>"
    }else{

    let curQuestionObj = questionArray[questionId];
   
   
    questionContainer.classList.remove("bg-danger");
    questionContainer.classList.remove("bg-success");
    let categoryBtn = document.getElementById("categoryMenuButton");
   
    let categoryDisplay = document.getElementsByClassName("category")[0];
    questionDisplay.innerHTML = curQuestionObj.question;
    categoryDisplay.innerHTML = curQuestionObj.category;
    categoryBtn.innerHTML = "<h3>Category: <br>"+curQuestionObj.category+"</h3>"

    //display answers
    
    let correctIndex = Math.floor(Math.random() * curQuestionObj.incorrect_answers.length);
    
    let answerArray = curQuestionObj.incorrect_answers;
    answerArray.splice(correctIndex,0,curQuestionObj.correct_answer)
    
 
    for(let j = 0; j<curQuestionObj.incorrect_answers.length;j++){
        if(j==correctIndex){
            newCorrectAnswer(curQuestionObj.correct_answer,questionId,j)

       
        }else {
            newWrongAnswer(curQuestionObj.incorrect_answers[j],questionId,j)
            
        }
       
    }
}
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
