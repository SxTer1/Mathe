const placeHolder = document.getElementById('placeholder');
const timer = document.querySelector('.timer');
const questionBox = document.querySelector('.question-box');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const refreshButton = document.querySelector('#refresh');
const resultsContainer = document.querySelector('.results')



let answers = 0;
let count = 3;
let targetTime = 210000;
let questionIndex;
let countdownInterval;
let questionArray;
let timerInterval;
let life = 1;




startButton.addEventListener('click', () => {
    readyToPlay();
    setTimeout(startCountdown, 3500);
  });
stopButton.addEventListener('click', () =>{
  stopTimer();
  
  beDisable(stopButton);
} );
$("body").keyup(function(event) {
    if (event.keyCode === 13) {
        checkInput();
    }
  });
 refreshButton.addEventListener('click', () =>{
    stopTimer();
    restartGame();
    readyToPlay();
    setTimeout(startCountdown, 3500);
  })



  function readyToPlay(){
    startButton.classList.add("hidden");
    stopButton.style.display= "block";
    refreshButton.style.display = "block";
    placeHolder.style.display = "block";
    placeHolder.value = "";
    stopButton.style.marginRight = "420px";
    questionBox.textContent = count;
    countdownInterval = setInterval(countdown, 1000);
}


  function countdown() {
    count--;
    questionBox.textContent = count;
    if (count <= 0) {
        questionBox.textContent = "Los geht's";
        clearInterval(countdownInterval);
        addQuestionToBox();
    }
}



async function addQuestionToBox() {
    try {
        const response = await fetch('1level.json');
        const array = await response.json();
        questionArray = array;
        setTimeout(startGame, 300);
      } catch (error) {
        alert(`Error: ${error}`)
      }
}

function startGame(){
    placeHolder.value = '';
    placeHolder.disabled = false;
    currentIndex = 0;
    questionBox.textContent = questionArray[currentIndex];
}
function checkInput(){

    let result;
    const inputValue = placeHolder.value;
    const currentQuestion = questionArray[currentIndex];

if(life === 4){
        questionBox.textContent = "GAME OVER!";
        stopTimer();
        
        
    } else{
    if (currentIndex <= 19){
        let splitedQuestion = currentQuestion.split(' ');
        let firstNumber = splitedQuestion[0];
        let secondNumber = splitedQuestion[2];
        let sign = splitedQuestion[1];
        

        if (sign === "+") {
            result = Number(firstNumber) + Number(secondNumber);
          } else if (sign === "-") {
            result = Number(firstNumber) - Number(secondNumber);
          } else if (sign === "/") {
            result = Number(firstNumber) / Number(secondNumber);
          } else if (sign === "*"){
            result = Number(firstNumber) * Number(secondNumber);
          } else {
            alert('error');
            return; 
          }
    } else if ( currentIndex > 19 && currentIndex < questionArray.length-1){
         result = currentQuestion.slice(-2);
    }


    if (inputValue == result){
      currentIndex++;
      answers++;
      placeHolder.value = '';

        if (currentIndex === 10){
            $('#difficulty').html("Level 2");
            $('#difficulty').addClass("yellow");
        } else if (currentIndex === 20){
            $('#difficulty').removeClass("yellow")
            $('#difficulty').html("Level 3");
            $('#difficulty').addClass("red");
        }
    

      if (currentIndex < questionArray.length) {
        questionBox.textContent = questionArray[currentIndex].slice(0,-2);
      } else {
        questionBox.textContent = 'Complete!';
        stopTimer();
      }
    } else {
        $(`.kreis:nth-child(${life})`).hide(400);
        life++
        currentIndex++;
        placeHolder.value = '';
        if (currentIndex < questionArray.length) {
            questionBox.textContent = questionArray[currentIndex].slice(0,-2);
          } else {
            questionBox.textContent = 'Complete!';
            stopTimer();
          }
    }
  }
}

function startCountdown(){
    let timeLeft = targetTime;
    stopButton.disabled = false;
    refreshButton.disabled = false;


    timerInterval = setInterval(() => {
        timeLeft -= 10; 
        
        if(timeLeft === 60000){
          timer.classList.remove('default');
          timer.classList.add('yellow');
        }
  
        if (timeLeft === 30000) {
          timer.classList.remove('yellow');
          timer.classList.add('red');
          
        }
       
  
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timer.textContent = '00:00:00';
          showResults();
          return;
        }
    
        timer.textContent = formatTime(timeLeft);
      }, 10);
}
function formatTime(time) {
    let minutes = Math.floor(time / 60000);
    let seconds = Math.floor((time % 60000) / 1000);
    let milliseconds = time % 1000;
  
    return `${padZero(minutes)}:${padZero(seconds)}:${padZero(milliseconds, 3)}`;
  }
  
  function padZero(value, length = 2) {
    return value.toString().padStart(length, '0');
  }

  function stopTimer() {
    clearInterval(timerInterval);
    showResults();
  }

  function showResults() {
    backdrop.classList.remove('is-hidden');
    if( answers < 10){
      resultsContainer.textContent = `${answers}/${questionArray.length}\n
      Exercise more`
      } else if ( answers >= 10 && answers <= 24){
        resultsContainer.textContent = `${answers}/${questionArray.length}\n
      good job`
      } else {
        resultsContainer.textContent = `${answers}/${questionArray.length}\n
      Amazing`
      }
      setTimeout(() => {
        backdrop.classList.add('is-hidden');
      }, 1000);
      placeHolder.disabled = true;
  }
  function restartGame() {
      
    $('.kreis').show(400);
    targetTime = 210000;
    count = 3;
    answers = 0;
    life = 1;
    timer.textContent = formatTime(targetTime);
    stopButton.disabled = true;
    refreshButton.disabled = true;
    placeHolder.disabled = true;
    $('#difficulty').removeClass("yellow")
    $('#difficulty').removeClass("red")
    $('#difficulty').addClass("default")
    $('#difficulty').html("Level 1");
    timer.classList.remove('red');
    timer.classList.add('default');
  }


 

 
