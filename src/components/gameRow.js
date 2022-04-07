import { AppBar, Typography } from '@mui/material';
import GameSquare from './gameSquare.js'

const GameRow = (props) => {
  var input = (props.input == undefined) ? "" : props.input.toUpperCase() || ""
  const submitted = props.isSubmitted || false
  const letterArr = input.split("")
  const dailyWord = props.dailyWord || "CABAL"
  // This is to avoid errors if input is shorter than letters
  for (let i=letterArr.length; i<5; i++)
    letterArr.push("")

  const letterCounter = (word, letter) => {
    var counter = 0
    for(var i=0; i<word.length; i++){
      if(word.charAt(i) == letter)
        counter++
    }
    return counter
  }

  const countCorrect = (input, dailyWord, letter) => {
    var counter = 0
    for(var i=0; i<dailyWord.length; i++){
      if(input.charAt(i) == letter && dailyWord.charAt(i) == letter)
        counter++
    }
    return counter
  }
  //Logic for determining letter outcomes
  const resultArr = ["none", "none", "none", "none", "none"]
  if(submitted){
    for(var i=0; i<5; i++){
      if(!dailyWord.includes(letterArr[i])){
        resultArr[i] = "missing"
      }
      else if(letterArr[i] == dailyWord.substring(i, i+1)){
        resultArr[i] = "correct"
      }
      else if(dailyWord.includes(letterArr[i])){
        // base case is if shared letters in guess is < the amount in daily word then is automatically fine to set as "appears"
        if(letterCounter(input, letterArr[i]) <= letterCounter(dailyWord, letterArr[i]) || letterCounter(input, letterArr[i]) == 1){
          resultArr[i] = "appears"
        }
        else {
          //FOR LOOP BACKWARDS AND COUNT AGAINST (<=) DAILY WORD COUNT ----- the most confusing part of this code, but seems to work as intended
          var counter = 0
          for(var j=i; j>=0; j--){
            if(letterArr[j] == letterArr[i])
              counter++
          }
          //COOL MATH THAT SEEMS TO WORK
          counter <= letterCounter(dailyWord, letterArr[i])-countCorrect(input, dailyWord, letterArr[i])
            ? resultArr[i] = "appears"
            : resultArr[i] = "missing"
        }
      }
    }
  }

  return(
    <div className="row">
      <GameSquare letter={letterArr[0]} result={resultArr[0]}/>
      <GameSquare letter={letterArr[1]} result={resultArr[1]}/>
      <GameSquare letter={letterArr[2]} result={resultArr[2]}/>
      <GameSquare letter={letterArr[3]} result={resultArr[3]}/>
      <GameSquare letter={letterArr[4]} result={resultArr[4]}/>
    </div>
  )
}

export default GameRow
