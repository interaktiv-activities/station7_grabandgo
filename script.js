const startButton = document.getElementById('start-button')

//SOUNDS
var correctSound = new Audio()
correctSound.src = "SOUNDS/match.wav"

var winSound = new Audio()
winSound.src = "SOUNDS/victory.wav"

var gameOverSound = new Audio()
gameOverSound.src = "SOUNDS/gameover.wav"

var backgroundMusic = new Audio();
backgroundMusic.src = "SOUNDS/happy.mp3"

function GameStart() 
{
  backgroundMusic.play()
  backgroundMusic.volume=0.1
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.getElementById('score')
  const title = document.getElementById('title-img')
  const passMessage = document.getElementById('pass-msg')
  const failMessage = document.getElementById('fail-msg')
  const menuButton = document.getElementById('menu-btn')
  const timerDisplay = document.getElementById('timer')
  let timer = 90
  const width = 8
  const squares = []
  let score = 0

  document.getElementById("container").style.display = "block"
  document.getElementById("parallax").style.display = "none"

  const candyColors = [
      'url(ASSETS/CHIPS.png)',
      'url(ASSETS/FLASHLIGHT.png)',
      'url(ASSETS/MEDKIT.png)',
      'url(ASSETS/SHIRT.png)',
      'url(ASSETS/WATER.png)',
      'url(ASSETS/WHISTLE.png)'
    ]

  var gameTimer = setInterval( () => {
    timer--
    timerDisplay.innerHTML = "TIMER: "+timer
  }
  , 1000)

  //create your board
  function createBoard() {
    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.setAttribute('draggable', true)
      square.setAttribute('id', i)
      let randomColor = Math.floor(Math.random() * candyColors.length)
      square.style.backgroundImage = candyColors[randomColor]
      grid.appendChild(square)
      squares.push(square)
    }
  }
  createBoard()

  // Dragging the Candy
  let colorBeingDragged
  let colorBeingReplaced
  let squareIdBeingDragged
  let squareIdBeingReplaced

  squares.forEach(square => square.addEventListener('dragstart', dragStart))
  squares.forEach(square => square.addEventListener('dragend', dragEnd))
  squares.forEach(square => square.addEventListener('dragover', dragOver))
  squares.forEach(square => square.addEventListener('dragenter', dragEnter))
  squares.forEach(square => square.addEventListener('drageleave', dragLeave))
  squares.forEach(square => square.addEventListener('drop', dragDrop))

  function dragStart(){
      colorBeingDragged = this.style.backgroundImage
      squareIdBeingDragged = parseInt(this.id)
  }

  function dragOver(e) {
      e.preventDefault()
  }

  function dragEnter(e) {
      e.preventDefault()
  }

  function dragLeave() {
      this.style.backgroundImage = ''
  }

  function dragDrop() {
      colorBeingReplaced = this.style.backgroundImage
      squareIdBeingReplaced = parseInt(this.id)
      this.style.backgroundImage = colorBeingDragged
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
  }

  function dragEnd() {
      //What is a valid move?
      let validMoves = [squareIdBeingDragged -1 , squareIdBeingDragged -width, squareIdBeingDragged +1, squareIdBeingDragged +width]
      let validMove = validMoves.includes(squareIdBeingReplaced)

      if (squareIdBeingReplaced && validMove) {
          squareIdBeingReplaced = null
      }  else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
      } else  squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
  }

  //drop candies once some have been cleared
  function moveIntoSquareBelow() {
      for (i = 0; i < 55; i ++) {
          if(squares[i + width].style.backgroundImage === '') {
              squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
              squares[i].style.backgroundImage = ''
              const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
              const isFirstRow = firstRow.includes(i)
              if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                let randomColor = Math.floor(Math.random() * candyColors.length)
                squares[i].style.backgroundImage = candyColors[randomColor]
              }
          }
      }
  }


  ///Checking for Matches
  //for row of Four
    function checkRowForFour() {
      for (i = 0; i < 60; i ++) {
        let rowOfFour = [i, i+1, i+2, i+3]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''

        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
        if (notValid.includes(i)) continue

        if(rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 4
          scoreDisplay.innerHTML = "SCORE: " + score
          rowOfFour.forEach(index => {
          squares[index].style.backgroundImage = ''
          correctSound.play()
          })
        }
      }
    }
    checkRowForFour()

  //for column of Four
    function checkColumnForFour() {
      for (i = 0; i < 39; i ++) {
        let columnOfFour = [i, i+width, i+width*2, i+width*3]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''

        if(columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 4
          scoreDisplay.innerHTML = score
          columnOfFour.forEach(index => {
          squares[index].style.backgroundImage = ''
          correctSound.play()
          })
        }
      }
    }
  checkColumnForFour()

    //for row of Three
    function checkRowForThree() {
      for (i = 0; i < 61; i ++) {
        let rowOfThree = [i, i+1, i+2]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''

        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
        if (notValid.includes(i)) continue

        if(rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 3
          scoreDisplay.innerHTML = "SCORE: " + score
          rowOfThree.forEach(index => {
          squares[index].style.backgroundImage = ''
          correctSound.play()
          })
        }
      }
    }
    checkRowForThree()

  //for column of Three
    function checkColumnForThree() {
      for (i = 0; i < 47; i ++) {
        let columnOfThree = [i, i+width, i+width*2]
        let decidedColor = squares[i].style.backgroundImage
        const isBlank = squares[i].style.backgroundImage === ''

        if(columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
          score += 3
          scoreDisplay.innerHTML = "SCORE: " + score
          columnOfThree.forEach(index => {
          squares[index].style.backgroundImage = ''
          correctSound.play()
          })
        }
      }
    }
  checkColumnForThree()

  // Checks carried out indefintely - Add Button to clear interval for best practise, or clear on game over/game won. If you have this indefinite check you can get rid of calling the check functions above.
  window.setInterval(function(){
      checkRowForFour()
      checkColumnForFour()
      checkRowForThree()
      checkColumnForThree()
      moveIntoSquareBelow()

      if (score >= 200){
        title.classList.add('hide')
        scoreDisplay.classList.add('hide')
        timerDisplay.classList.add('hide')
        grid.classList.add('hide')
        menuButton.classList.remove('hide')
        passMessage.classList.remove('hide')
        winSound.play()
        let volumeWin = 1
        volumeWin--
        gameOverSound.volume() = volumeWin
        backgroundMusic.pause()
        clearInterval(gameTimer)
      } else if (timer == 0){
        title.classList.add('hide')
        scoreDisplay.classList.add('hide')
        timerDisplay.classList.add('hide')
        grid.classList.add('hide')
        failMessage.classList.remove('hide')
        gameOverSound.play()
        let volumeGameOver = 1
        volumeGameOver--
        gameOverSound.volume() = volumeGameOver
        backgroundMusic.pause()
        clearInterval(gameTimer)
      } 
    }, 100)
}


