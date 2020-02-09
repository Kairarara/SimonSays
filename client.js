$(document).ready(()=>{
  let sequence=[],
      strictIsOn=false,
      isPlayerTurn=false,
      playerPointer=0,
      gameTurn=0,
      buttonsId=["greenButton","redButton","blueButton","yellowButton"],
      buttonAudio=[new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
                   new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
                   new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
                   new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")],
      activeButton="",
      cap=20,
      playingSequence=false,
      effectsLength=650;
  
  
  function resetGame(){
    sequence=[];
    isPlayerTurn=false;
    playerPointer=0;
    gameTurn=0
  }
  
  function  playButtonEffects(key){
    let buttonClass=buttonsId[key]+"Active";
    $("#"+buttonsId[key]).addClass(buttonClass);
    buttonAudio[key].play()
    buttonAudio[key].onended=()=>{
      $("#"+buttonsId[key]).removeClass(buttonClass);
      buttonAudio[key].onended=null;
    }
  }
  
  function playSequence(seq=sequence){
    playingSequence=true;
    $("#displayValue").text(gameTurn)
    for(let i=0;i<seq.length;i++){
      setTimeout(()=>{if(playingSequence) playButtonEffects(seq[i])},i*effectsLength)
    }

  }
  
  function playGame(){
    isPlayerTurn=false;
    gameTurn++;
    let val=Math.floor(Math.random() * 3)
    sequence.push(val);
    playerPointer=0;
    playSequence();
    setTimeout(()=>{
      isPlayerTurn=true
    },sequence.length*effectsLength)
  }
  
  function handleMouseDown(){
    if(isPlayerTurn){
      let key=Number($(this).data("key"))
      activeButton=event.target.id+"Active";
      $(this).addClass(activeButton)
      buttonAudio[key].currentTime=0;
      buttonAudio[key].play();
      $(this).on("mouseup mouseout",handleMouseUp)
    }
  }
  
  function handleMouseUp(){
    if(isPlayerTurn){
      let key=Number($(this).data("key"));
      $(this).removeClass(activeButton)
      if(sequence[playerPointer]===key){
        if(playerPointer<gameTurn-1){
          playerPointer++
        } else {
          let timeOut=1000;
          if(playerPointer==cap-1){
            $("#displayValue").text("WIN!!")
            resetGame();
            timeOut=2000
          }
          setTimeout(()=>{playGame()},timeOut)
        }
      } else {
        handleMistake()
      }
      $(this).off("mouseup mouseout",handleMouseUp)
    }
  }
  
  function handleMistake(){
    $("#displayValue").text("AGAIN")
    setTimeout(()=>{
      if(strictIsOn){
        resetGame();
        playGame();
      } else {
      $("#displayValue").text(gameTurn)
        playerPointer=0;
        isPlayerTurn=false;
        playSequence();
        isPlayerTurn=true;
      }
    },1000)
  }
  
  $("#toggleSwitch").on("click",()=>{
    playingSequence=false;
    strictIsOn=!strictIsOn;
    if(gameTurn>0){
      resetGame();
      playGame();
    } else {
      resetGame();
    }
  })
  
  $("#startButton").on("click",()=>{
    playingSequence=false;
    if(gameTurn===0)
      $("#displayValue").text("START!")
    setTimeout(()=>{
      resetGame();
      playGame();
    },1000)
  })
  
  $(".buttons").on("mousedown",handleMouseDown)
})