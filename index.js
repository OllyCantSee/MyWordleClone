const ANSWER_LENGTH = 5
let inputIsLetter
let currentLetter = 0
let enteredWord = ["", "", "", "", ""]
let todaysWord = ""
let todaysWordArray = "";
let lettersGuessedCorrectly = []
let incorrectLetters = []
let userAttempts = 0
let gameWon = false
let fiveLetterWords = []

let restartButton = document.querySelector(".restart-game")

window.onload = async function() {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day?random")
  const resObj = await res.json()
  todaysWord = await resObj.word.toUpperCase()
  todaysWordArray = Array.from(todaysWord)
}


function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter)
}


function gameWin() {
  const guessAttemptText = document.querySelector(".congratsh2")

  console.log(userAttempts)

  switch (userAttempts) {
    case 1:
      guessAttemptText.innerText = "First try! WOW! but, you cheated, lets be honest, i mean sure, you might have got lucky BUT THERE ARE LIKE 5000 5 letter words so I simply do not accept that. Dont cheat, its not funny, look around, IS ANYONE LAUGHING?"
      break
    case 2:
      guessAttemptText.innerText = "Second try! Impressive, but I still dont believe that just happened"
      break
    case 3:
      guessAttemptText.innerText = "Third try? Lousy Attempt! In all honesty, I thought you were better."
      break
    case 4:
      guessAttemptText.innerText = "Fourth try?, Not great, all you have to do is look at the letters???"
      break
    case 5:
      guessAttemptText.innerText = "Wow! You're not good! Like not good at all, a child could of beat you."
      break
    case 6:
      guessAttemptText.innerText = "Phew! you do know what you need to do right, you need to guess the word, like using the yellow and green background things?"
      break
  }

  document.querySelector(".congrats").classList.add("visible")

  enteredWord = ["", "", "", "", ""]
  todaysWordArray = ""
  lettersGuessedCorrectly = []
  incorrectLetters = []
  userAttempts = 0

  const letters = document.querySelectorAll(".letter")

  for (let i = 0; i < letters.length; i++) {
    letters[i].id = "NULL";
  }
}


function gameLose() {

  document.querySelector(".word-reveal").classList.add("visible")
  document.querySelector(".word-reveal").innerHTML = todaysWord
}


async function compareWords(usersWord) {
  let enteredWordString = usersWord.join('') 


  let res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({word: enteredWordString})
  })

  let resObj = await res.json()
  let validWord = resObj.validWord;


  if (validWord === false) {
    document.querySelector('.error-message').innerText = "Invalid Word"
    document.querySelector('.error-message').classList.add("visible")

    
    setTimeout( () => {
      document.querySelector('.error-message').classList.remove("visible")
    }, 2000)
    return

  } else {
    userAttempts++
  }


  todaysWordArray = todaysWordArray.map(letter => letter.toUpperCase())
  usersWord = usersWord.map(letter1 => letter1.toUpperCase())

  const map = MakeMap(todaysWordArray)

  for (i = 0; i < ANSWER_LENGTH; i++) {
    if(todaysWordArray[i] === usersWord[i]) {
      document.getElementById(i).classList.add("correct")
      map[usersWord[i]]--
    }
  }

  for (i = 0; i < ANSWER_LENGTH; i++) {
    if(todaysWordArray[i] === usersWord[i]) {
      // DO NOTHING, WE ALREADY DID IT
    } else if (todaysWordArray.includes(usersWord[i]) &&  map[usersWord[i]] > 0){
      document.getElementById(i).classList.add("close")
      map[usersWord[i]]--
    } else {
      document.getElementById(i).classList.add("wrong")
    }
  }

  let correctLetter = 0

  for (i = 0; i < ANSWER_LENGTH; i++) {
    if (usersWord[i] === todaysWordArray[i]) {
      correctLetter++
    }
    if (correctLetter === 5) {
      gameWon = true
      gameWin()
    }
  }


  for (i = 0; i < ANSWER_LENGTH; i++) {
    document.getElementById(i).id = "NULL"
  }

  if (userAttempts === 6 && gameWon === false) {
    gameLose()
  }

  currentLetter = 0
  correctLetter = 0
  document.querySelector('.error-message').classList.remove("visible")
}


document.addEventListener('keydown', async function(event) {
  inputIsLetter = isLetter(event.key)

  if (inputIsLetter === true && currentLetter != ANSWER_LENGTH) {
    enteredWord[currentLetter] = event.key
    document.getElementById(currentLetter).innerText = event.key
    currentLetter += 1

  } else if (event.key === "Backspace" && currentLetter != 0) {
    currentLetter--
    enteredWord[currentLetter] = ""
    document.getElementById(currentLetter).innerHTML = ""
    
  } else if (event.key === "Enter" && currentLetter === ANSWER_LENGTH) {
    compareWords(enteredWord)

  } else if (event.key === "Enter" && currentLetter < ANSWER_LENGTH) {
    document.querySelector('.error-message').innerText = "Word too short"
    document.querySelector('.error-message').classList.add("visible")

    setTimeout( () => {
      document.querySelector('.error-message').classList.remove("visible")
    }, 2000)
  }
})

function MakeMap (array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i]
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1
    }
  }
  
  return obj
}


