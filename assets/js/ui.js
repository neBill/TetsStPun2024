'use strict';

let rightOptionIndex;
let isLearnMode;
let historyIndex;
let isHistorySave = true;
let isShuffle = false;
let isAnswerDone = false;


class CurrentTest {
   constructor(test, id) {
     this.index = test
     this.id = id
   }
}

class Counter {
  constructor(index) {    
    this.index = index
  }
}

class WrongAnswers {
   constructor(answer) {
     this.answer = answer
   }
}


class Errors {  
  errors = []  
  addError(error) {   
    this.errors.push(error)
  }
}

const wrongAnswers = new Errors();
const currentIndex = new Counter(0);
const currentTest = new CurrentTest();


function putToCache(elem, cache) {
  if (cache.indexOf(elem) !== -1) {
    return;
  }
  let i = Math.floor(Math.random() * (cache.length + 1));
  cache.splice(i, 0, elem);
}


function madness() {
  let cache = [];
  return function(a, b) {
    putToCache(a, cache);
    putToCache(b, cache);
    return cache.indexOf(b) - cache.indexOf(a);
  };
}


function shuffle(arr) {  
  
    let compare = madness();
    return arr.sort(compare);
  
}

function showErrors(id) {

  let indexes =  wrongAnswers.errors[id];

  document.getElementById('test').style.display = 'block';
  
  const index = indexes[0];
  
  const chosenIndex = indexes[1]; 
  
  let answerButtonBorder;
  for (var i = 0; i < 4; ++i) {
    answerButtonBorder = 'none';
    if (currentTest.test[index][1][i][1] == 1) {
      answerButtonBorder = 'var(--right-answer-border)';
    }

    document.getElementById('option' + i).style.border = answerButtonBorder;
    document.getElementById('option' + i).innerHTML = currentTest.test[index][1][i][0];
    document.getElementById('option' + i).disabled = true;
  }
  document.getElementById('option' + chosenIndex).style.border = 'var(--wrong-answer-border)';
  document.getElementById('question').innerHTML = currentTest.test[index][0];
}

function updateQuestionBlock() {
 
  let currentQuestionBlock = currentTest.test[currentIndex.index]; 

  let optionsCount = currentQuestionBlock[1].length;  

  if(optionsCount < 4) {

    while(optionsCount < 4) {

      currentQuestionBlock[1].push(["Нет варианта ответа (*)", 0]);
      optionsCount++;

    }

  }  

  
  shuffle(currentQuestionBlock[1]);  
  
  for (var i = 0; i < 4; ++i) {
    if (currentQuestionBlock[1][i][1] == 1) {
      rightOptionIndex = i;
    }
    document.getElementById('option' + i).innerHTML = currentQuestionBlock[1][i][0];
    document.getElementById('option' + i).style.border = 'none';
    document.getElementById('option' + i).disabled = false;
  }
  document.getElementById('question').innerHTML = currentQuestionBlock[0];

  document.getElementById('counter').innerHTML = `Вопрос: ${currentIndex.index + 1}/${currentTest.test.length}`;
  
}


function setTrainingMode(optionIndex) {
  
  document.getElementById('button_next').style.display = "inline-block";

  let borderColor = '';
   
  if (currentTest.test[currentIndex.index][1][optionIndex][1] == 1) {
   
    borderColor = "var(--right-answer-border)";
    
  } else {
   
    borderColor = "var(--wrong-answer-border)";
    
    document.getElementById('option' + rightOptionIndex).style.border = "var(--right-answer-border)";
  }

    document.getElementById('option' + optionIndex).style.border = borderColor;  
      
  for (let element of document.getElementById('test').children) {
    element.disabled = true;
  }
    
}



function calcRightAnswers(questionsQuantity, errorsQuantity ) {

  let rightAnswersQuantity = Math.round(questionsQuantity - errorsQuantity);

  let percent = Math.round(rightAnswersQuantity * 100 / (questionsQuantity));

  return { rightAnswers: rightAnswersQuantity, errorsPercent: percent };
}



function showTestResult(isTestFinished) {
  
  if(currentIndex.index === 0 || isAnswerDone === false) {
    showLevels();
    return;
  }
  
  // let testState = '';
  // let state = ''; 

  let testState, questionQuantity, state = '';
 // let state = ''; 

  if (localStorage.getItem(currentTest.id)) {
   
    getErrorsArray();

    //alert(wrongAnswers)
  }
 

  //let questionQuantity = '';
 
   

  if (isTestFinished === false) {

   // testState = `<br>Тест остановлен.<br>Пройдено вопросов: ${currentQuestionIndex} из ${currentTest.length}<br>`;
     state = 'остановлен';
     questionQuantity = currentIndex.index;
     
  }

  else {
   
    state = 'завершен';
    questionQuantity = currentIndex.index + 1;
  }

  testState = `<br>Тест ${state}.<br>Пройдено вопросов: ${questionQuantity} из ${currentTest.test.length}<br>`;


  const { rightAnswers, errorsPercent } = calcRightAnswers(questionQuantity, wrongAnswers.errors.length);
  

  let success = '';

  if(state === 'завершен') {
      success = '<br>Тест успешно пройден!<br>';    
  }
    
  const unsuccess = '<br>Ваши ошибки:<br>';

  let result = `${testState}Правильных ответов:  ${rightAnswers} из ${questionQuantity} (${errorsPercent}%)`;

  result += (errorsPercent < 100) ? unsuccess : success;
  
  document.getElementById('result').innerHTML = result;

  for (var index = 0; index < wrongAnswers.errors.length; ++index) {
    const btn = document.getElementById('errors');
    btn.innerHTML += `<button id="${index}" class="error_button">${index + 1}</button>`;
  }
}



document.addEventListener("click", function(event) {
  const buttonClass = event.target.className;

  const buttonId = event.target.id;
  
  if (buttonClass == "error_button") {
    

    const links = document.querySelectorAll(".error_button");

   
    showErrors(buttonId);

    links.forEach(link => {
      link.setAttribute("style", "background:`:root { --main-bg-color}`");

    });
    document.getElementById(buttonId).style.background = "var(--error-btn-color)";
  }

  

  if (buttonClass == "font-size-change") {
    
     chageFontSize(buttonId);
  }


});


//переход на главную страницу,нажата кнопка На главную
button_home.addEventListener("click", function(event) {

  const buttonText = event.target.textContent

  if (buttonText == "Завершить") {

    showResultsPage();
    showTestResult(false);
    
    
      
  }
  if (buttonText == "На главную") { 

    isAnswerDone = false;
    
    showLevels();

  }


  if(isShuffle) {
   
    localStorage.removeItem(currentTest.id);
    currentTest.id = '';

    
  }
  
  currentIndex.index = 0;


})

button_next.addEventListener("click", function() {

  updateQuestionBlock();
  document.getElementById('button_next').style.display = "none";

})



function saveTestHistory(optionIndex) {   

  let testSavedName = currentTest.id;

  const savedItem = localStorage.getItem(testSavedName);

  let wrongOption = ''

  if (optionIndex != rightOptionIndex) {

    wrongOption = `[${currentIndex.index},${optionIndex}]`;
    
  }
  

  if(savedItem == null){

   
    
    localStorage.setItem(testSavedName, `${currentIndex.index}$${wrongOption}`);
    
  } else {

        
      let history = savedItem.split("$");

      let historyData = history[1];

    

    if (history[0] <= currentTest.test.length) {

      let newData = '';

      if (historyData.length != 0 && wrongOption.length != 0) {

        historyData += "; ";

      }

     
      if (wrongOption.length == 0) {        

        
        newData = `${currentIndex.index}$${historyData}`;

      } else {

        newData = `${currentIndex.index}$${historyData}${wrongOption}`;
       
      }

     
      localStorage.setItem(testSavedName, newData);

    }

  }
 

}


function check(optionIndex) {  

  isAnswerDone = true; 
  
  //alert(currentIndex.index)
 
  if (currentIndex.index === currentTest.test.length - 1) {  
   
    finilizeTest(optionIndex);    
   
    return;

  }
  // //  LearnMode   
  // if (isLearnMode === true && optionIndex != rightOptionIndex) {     
    
  //   setTrainingMode(optionIndex);
  //   return;
  // } 

  if(isHistorySave){   
    saveTestHistory(optionIndex);
  }
  
  

  //  LearnMode   
  if (isLearnMode === true && optionIndex != rightOptionIndex) {     
    setTrainingMode(optionIndex);
    currentIndex.index++;
    return;
  } 

  currentIndex.index++;

  

  updateQuestionBlock();

}

function finilizeTest(optionIndex) {

 // if(isHistorySave){
    saveTestHistory(optionIndex);
  //}
  showResultsPage();
  showTestResult(true);

  currentIndex.index = 0;

 
  
}




function showMainPage() {

  document.getElementById('main_page').style.display = "block";
  document.getElementById('results').style.display = "none";
  document.getElementById('levels').style.display = "none";
  document.getElementById('questions_counter').style.display = 'none';
  document.getElementById('test').style.display = "none";
  document.getElementById('nav_block').style.display = "none";
  document.getElementById('result').style.display = "none";
 
}



function showLevels() {

  document.getElementById('button_home').style.display = "none";
  document.getElementById('nav_block').style.display = "none";
  document.getElementById('levels').style.display = "block";
  document.getElementById('errors').innerHTML = "";
  document.getElementById('test-title').innerHTML = "";
  document.getElementById('results').style.display = "none";
  document.getElementById('test').style.display = "none";
  document.getElementById('button_menu').style.display = "block";
  
      wrongAnswers.errors.length = 0;

  //currentQuestionIndex = 0;
}

function showTest() {
  document.getElementById('questions_counter').style.display = 'block';
  document.getElementById('levels').style.display = "none";
  document.getElementById('counter').style.display = "block";
}



function getCurrentIndex(testId) {      

  let currentIndex = 0; 

  if(testId in localStorage) {

    const history = getTestHistory(testId);   

    if (extractIndex(history) === currentTest.test.length) {
 
      removeTestHistory(testId);

    }
    if(extractIndex(history) < currentTest.test.length ) {

       currentIndex = extractIndex(history)
    }


  }

  return currentIndex;
   
}


function extractIndex(history) {

  return Number(history.slice(0, history.indexOf("$"))) + 1;
  
}




function getErrorsArray() {
  
  let errors = localStorage.getItem(currentTest.id).split("$");
  
  if (errors[1].length == 0) return;

  let errors_array = errors[1].split(';');

  errors_array.forEach(error => {

    var array = JSON.parse(error);
    
        wrongAnswers.addError(array)

  });

  
}



//choose test
document.addEventListener("click", function(event) {    

  if(event.target.className !== "test_button") return;

  currentTest.id = event.target.id;            

  currentTest.test = chooseTest(currentTest.id);
  
  if (isShuffle) {   
  
    shuffle(currentTest.test);  

    currentTest.id += '$';

  } 

  if(isLearnMode) { 

    currentTest.id += '*';

  }

  currentIndex.index = getCurrentIndex(currentTest.id);
    
  showChosenTest(event.target.textContent, currentTest.test.length); 

  updateQuestionBlock();

})


function removeTestHistory(testId) {      

  localStorage.removeItem(testId);

}

function getTestHistory(testId) {

  return localStorage.getItem(testId)

}

function setTestHistory(testId) {

  localStorage.setItem(testId)

}



function chooseTest(testId) { 

  const testList = {
   
    pir_b : test_pir_b,
    pir_s : test_pir_s,
    pir_e : test_pir_e,
    gid_b : test_gid_b,
    gid_s : test_gid_s,
    gid_e : test_gid_e,
    per_b : test_per_b,
    per_s : test_per_s,
    per_e : test_per_e,
    ot_25 : test_otgid,

    
  }
  
  return testList[testId];
}




function showResultsPage() {
  document.getElementById('button_home').style.display = "block";
  document.getElementById('button_next').style.display = "none";
  document.getElementById('results').style.display = 'block';
  document.getElementById('test').style.display = "none";
  document.getElementById('result').style.display = "block";
  document.getElementById('counter').style.display = "none";
  document.getElementById('button_home').innerText = "На главную";
}

function showChosenTest(testName, testLength) {

  document.getElementById('test').style.display = "block";
  document.getElementById('counter').innerHTML = "Вопрос: 1/" + testLength;
  document.getElementById('counter').style.display = "block";
  document.getElementById('questions_counter').style.display = 'block';
  document.getElementById('levels').style.display = "none";
  document.getElementById('nav_block').style.display = "block";
  document.getElementById('button_next').style.display = "none";
  document.getElementById('button_home').innerText = "Завершить";
  document.getElementById('button_home').style.display = "block";
  document.getElementById('button_menu').style.display = "none";
  document.getElementById('test-title').innerHTML = testName;
  
}
