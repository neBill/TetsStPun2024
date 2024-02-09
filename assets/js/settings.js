'use strict';

function chageFontSize(buttonId){  

  const bodyStyles = window.getComputedStyle(document.body);

  const oldSize = bodyStyles.getPropertyValue('--btn-font-size'); //get
  
  let newSize = 1.7;    
  
  if(buttonId == "font-increase"){  
    
    newSize = (parseFloat(oldSize) + 0.1).toFixed(2);       
  }

  if(buttonId == "font-decrease"){
     
    newSize = (parseFloat(oldSize) - 0.1).toFixed(2);
  }   
 
  if(newSize <= 2.0 && newSize >= 1.4){

    document.body.style.setProperty("--btn-font-size", `${newSize}em`);//set

    document.getElementById('fontsize').style.fontSize = `${newSize}em`;
    
    localStorage.setItem('size', newSize);
  }
  
}




function clearCaches(){  
  caches.open('s-app-v1').then(cache => {
    cache.keys().then(keys => {
      keys.forEach(request => {
        cache.delete(request);
      });
    });
  });
}

function clearHistory() {

  localStorage.clear(); 
  
}




window.addEventListener("load", ()=>{

   //loadSettings();
   document.body.className = 'light-theme';

  loadSettings();
  // testList.push(test);
  //document.body.className = 'light-theme';
  


  

});







//////////////////////////????????????

//   let deviceId = localStorage.getItem('deviceId');

//   if (!deviceId) {
    
//     deviceId = generateDeviceId();
//     localStorage.setItem('deviceId', deviceId);

//   }

// }




function showMenu() {

  let isMenuShown = document.getElementById("dropDownMenu").classList.toggle("visible");

  if(isMenuShown === false){

    saveSettings();
    
  }
  
}

function hideMenu() { 

  document.getElementById("dropDownMenu").classList.remove("visible");  
  
  saveSettings();
}

function hideHelpPage() {

  document.getElementById("help_block").style.display = "none"; 
  //alert('hhh')
  
}

function showHelpPage() {

  document.getElementById("help_block").style.display = "block"; 
  hideMenu();

}



function loadSettings(){
 
  if(!localStorage.getItem('settings'))  return

  let togglesState = JSON.parse(localStorage.getItem('settings'));  
  
  apply(togglesState);
 
}

function apply(togglesState){  
  
  document.getElementById('theme_toggle').checked = togglesState.isDarkTheme; 
  document.getElementById('shuffle_toggle').checked = togglesState.isShuffle;
  document.getElementById('learn_mode_toggle').checked = togglesState.isLearn;
 

  isLearnMode = togglesState.isLearn;
  isShuffle = togglesState.isShuffle;
 
  if (togglesState.isDarkTheme == true) { 
    
    //document.documentElement.setAttribute('theme', 'dark');
    document.body.className = 'dark-theme';
  }
  else {
    
     //document.documentElement.removeAttribute('theme'); 
    document.body.className = 'light-theme';
  }

  
    
}


// document.getElementById('themeToggle').addEventListener('click', function() {
//     // Этот код будет выполняться при каждом клике на кнопку

//     // Получаем текущий класс, заданный для элемента body (текущую тему)
//     const currentTheme = document.body.className;

//     // Проверяем, является ли текущая тема светлой
//     if (currentTheme === 'light-theme') {
//         // Если да, меняем тему на темную
//         document.body.className = 'dark-theme';
//     } else {
//         // Если текущая тема не светлая (или отсутствует), устанавливаем светлую тему
//         document.body.className = 'light-theme';
//     }
// });

function saveSettings(){  
  
  const togglesState = {
   // isHistory:document.getElementById('save_history_toggle').checked,
    isLearn:document.getElementById('learn_mode_toggle').checked,
    isShuffle:document.getElementById('shuffle_toggle').checked,
    isDarkTheme:document.getElementById('theme_toggle').checked
  }

  apply(togglesState);

  localStorage.setItem("settings", JSON.stringify(togglesState));
}

// function generateDeviceId() {
//   // generate a random string
//   return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// }



