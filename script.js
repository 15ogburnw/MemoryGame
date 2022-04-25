//fix win screen and score storage

const gameContainer = document.getElementById("game");


let firstClick;
let secondClick;
let firstColor;
let secondColor;
let firstCard;
let secondCard;

//This function creates a random RGB color
function randomColor(){
  r = Math.floor(Math.random()*255)+1;
  g = Math.floor(Math.random()*255)+1;
  b = Math.floor(Math.random()*255)+1;
  let color = `rgb(${r},${g},${b})`
  return color;
}
 
//This function creates an array of random RGB colors, with each color having one duplicate. The number of unique colors is passed into the function
function createColorArray(numColors){
  const colorArray1 = [];
  let color;
  for(i=1;i<=numColors;i++){
    color = randomColor();
    colorArray1.push(color);
  }
  const colorArray2 = colorArray1.slice();
  const colorArray = colorArray1.concat(colorArray2);
  return colorArray;
}


// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}




//Start the Game using the Start Game! Button, choosing the number of cards based on the amount of colors that the user entered. If the user does not enter a number, the game defaults to 10 colors
let startButton = document.querySelector('button.start');
let textInput = document.querySelector('input[type = "text"]');
startButton.addEventListener('click',function(){
    let numColors;
  if(!startButton.classList.contains('isClicked')&&textInput.value){
    numColors = textInput.value;
    let COLORS = createColorArray(numColors);
    let shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    startButton.classList.add('isClicked');
    textInput.value = '';
  } else if (!startButton.classList.contains('isClicked')){
    numColors = 10;
    let COLORS = createColorArray(numColors);
    let shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    startButton.classList.add('isClicked');
  }
})
 


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}


let currentScore = 0;
// This function contains the logic for clicking on pairs of colored cards
function handleCardClick(event) {
 
  
 //If the first card has not been clicked, this changes the color and designates it as clicked
  if(!firstClick){
    firstCard = event.target;          
    if(!firstCard.classList.contains('isClicked') &&!firstCard.classList.contains('completed')){
      firstCard.style.backgroundColor = firstCard.className;
      firstCard.classList.add('isClicked');
      firstColor = firstCard.className;
      firstClick = true;
    
    }else if(!firstCard.backgroundColor && firstCard.classList.contains('isClicked')){
      firstCard.classList.remove('isClicked');
    }
    
    }
    
  //If the first card has been clicked but the second one hasn't, this changes the color of the second card and designates it as clicked
  else if(!secondClick){
   secondCard = event.target
    if(!secondCard.classList.contains('isClicked')&&!secondCard.classList.contains('completed')){
      secondCard.style.backgroundColor = secondCard.className;
      secondCard.classList.add('isClicked');
      secondColor = secondCard.className;
      secondClick =true;
      currentScore++;
    } else if(!secondCard.backgroundColor && secondCard.classList.contains('isClicked')){
      secondCard.classList.remove('isClicked');
    }
    }
    
  
    //if the two cards are equal in color, this keeps them colored but removes the isClicked designation on the cards so that another pair can be clicked
  if(firstColor === secondColor){
    firstClick = false;
    secondClick = false;
    firstColor = '';
    secondColor = '';
    firstCard.classList.toggle('isClicked');
    secondCard.classList.toggle('isClicked');
    firstCard.classList.add('completed');
    secondCard.classList.add('completed');
  }
  //If the colors are different, a timer is set for one second, then the cards are reverted back to white and reset.
  else if(secondColor){
    setTimeout(function(){
      firstCard.style.backgroundColor='';
      secondCard.style.backgroundColor='';
      firstCard.classList.toggle('isClicked');
      secondCard.classList.toggle('isClicked');
      firstClick = false;
      secondClick = false;
      firstColor = '';
      secondColor = '';
    },1000);
    
  }
  
  // if(event.target.classList.contains('completed') && !event.target.backgroundColor){
  //   event.target.classList.remove('completed');
  // }

  
  let score = document.querySelector('#currentScore');
  score.innerText = `Number of Guesses: ${currentScore}`;
  
    let allCards = document.querySelectorAll('#game > div');
    let completedCards = document.querySelectorAll('#game > .completed');
  
  //creates a victory pop-up when the player completes the game. This checks if all card divs contain the "completed" class. It also displays the player's final score. If the player is playing with 10 colors, it updates the localStorage and the "Best Score" graphic.
    if(allCards.length === completedCards.length){
      let winDiv = document.createElement('div');
      let winMessage = document.createElement('h3');
      let finalScore = document.createElement('h4');
      let playAgain = document.createElement('button');
      playAgain.id = 'playAgain';
      playAgain.innerText = 'Play Again!';
      winMessage.innerText = 'Congratulations, you win!'
      finalScore.innerText = `Final Score: ${currentScore}`
      winDiv.id = "win";
      gameContainer.append(winDiv);
      winDiv.append(winMessage);
      winDiv.append(finalScore);
      winDiv.append(playAgain);
      
      
      //checks if the player is playing with 10 colors and updates the localStorage if they get a high score with 10 colors.
      let numCol = allCards.length/2;
      let hiScore = document.querySelector('#bestScore');
      
      if(!localStorage.highScore && numCol === 10){
        localStorage.setItem('highScore',currentScore);
        hiScore.innerText = `Best Score (10 colors): ${localStorage.highScore}`
      }else if(currentScore < parseInt(localStorage.highScore) && numCol === 10){
        localStorage.setItem('highScore',currentScore);
        hiScore.innerText = `Best Score (10 colors): ${localStorage.highScore}`
      }
      
      
      
     //adds functionality for the "Play Again!" button on the victory window
      playAgain.addEventListener('click',function(){
      if(startButton.classList.contains('isClicked')){
            gameContainer.innerHTML = '';
            startButton.classList.remove('isClicked');
            currentScore = 0;
            score.innerText = 'Number of guesses: 0';
         }
      })
    }
}

//This section of code resets the game when the Reset Game button is pressed.
let resetButton = document.querySelector('button.reset');
resetButton.addEventListener('click',function(){
  if(startButton.classList.contains('isClicked')){
    gameContainer.innerHTML = '';
    startButton.classList.remove('isClicked');
    currentScore = 0;
    let score = document.querySelector('#currentScore');
    score.innerText = 'Number of guesses: 0';
  }
})

let hiScore = document.querySelector('#bestScore');
if(localStorage.highScore){
        hiScore.innerText = `Best Score (10 colors): ${localStorage.highScore}`
      }
  
    
 




/* */