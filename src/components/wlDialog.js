// This is the pop up dialog modal for Win/Loss/Share handleing
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
import winImg from '../resources/CaydeThumbsUp.png'
import loseImg from '../resources/UldrenNo.png'

//TODOS
// Maybe add my socials to endpage for exposure
// popup snackbar to confirm copy to clipboard

//copy pasta from https://mui.com/material-ui/react-dialog/ to add close button to top right corner
//didn't know you could call 'styled' on a mui compnent / would be better than adding 'sx' property a bunch
//could add transparent purple to background of dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    color:'white',
    background:'#242526'
  },
}))

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle variant="h4" fontFamily="fantasy" sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'center'}} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

//I should DEFINITELY be using this on my other components (currently am not)
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
}

// SHARE RESULTS SECTION
function copyText(entryText){
  navigator.clipboard.writeText(entryText)
}

//functions from gameRow.js
const letterCounter = (word, letter) => {
  var counter = 0
  for(var i=0; i<word.length; i++){
    if(word.charAt(i) === letter)
      counter++
  }
  return counter
}

const countCorrect = (input, dailyWord, letter) => {
  var counter = 0
  for(var i=0; i<dailyWord.length; i++){
    if(input.charAt(i) === letter && dailyWord.charAt(i) === letter)
      counter++
  }
  return counter
}

const makeLetterArr = (inputIn, dailyWordIn) => {
  //should probably force upper case or lowercase before this step but whatever
  const input = inputIn.toUpperCase()
  const dailyWord = dailyWordIn.toUpperCase()
  const letterArr = input.split("")
  const resultArr = ["none", "none", "none", "none", "none"]
  for(var i=0; i<5; i++){
    if(!dailyWord.includes(letterArr[i])){
      resultArr[i] = "missing"
    }
    else if(letterArr[i] === dailyWord.substring(i, i+1)){
      resultArr[i] = "correct"
    }
    else if(dailyWord.includes(letterArr[i])){
      // base case is if shared letters in guess is < the amount in daily word then is automatically fine to set as "appears"
      if(letterCounter(input, letterArr[i]) <= letterCounter(dailyWord, letterArr[i]) || letterCounter(input, letterArr[i]) === 1){
        resultArr[i] = "appears"
      }
      else {
        //FOR LOOP BACKWARDS AND COUNT AGAINST (<=) DAILY WORD COUNT ----- the most confusing part of this code, but seems to work as intended
        var counter = 0
        for(var j=i; j>=0; j--){
          if(letterArr[j] === letterArr[i])
            counter++
        }
        //COOL MATH THAT SEEMS TO WORK
        counter <= letterCounter(dailyWord, letterArr[i])-countCorrect(input, dailyWord, letterArr[i])
          ? resultArr[i] = "appears"
          : resultArr[i] = "missing"
      }
    }
  }
  return resultArr
}

const arrToEmoji = (arr) => {
  var outStr = ""
  for(var i=0; i<arr.length; i++){
    if(arr[i] === "correct"){
      outStr += "🟩"
    }
    else if(arr[i] ==="appears"){
      outStr += "🟧"
    }
    else{
      outStr += "⬛"
    }
  }
  outStr += '\n'
  return outStr
}

//return result as string
const makeResultStr = (counter, answers, dailyWord, isWin, dateIndex) => {
  var outStr = 'Derdle ' +(dateIndex+1)+ ' ' + (isWin ? counter : "X") + '/6 \n\n'
  //loop through answers to make the rows and add emojis to outStr
  for(var i=0; i<counter; i++){
    outStr += arrToEmoji(makeLetterArr(answers[i], dailyWord))
  }
  return outStr
}

const WLDialog = (props) => {
  // I should have been using nullish operator instead of logical OR in other components probably
  const open = props.open ?? false
  const setOpen = props.setOpen
  const isWin = props.isWin ?? false
  //TODO copy posta logic from ROW to copy results to clipboard
  const answers = props.answers ?? []
  const counter = props.counter ?? 0
  const dailyWord = props.dailyWord ?? "CABAL"
  const dateIndex = props.dateIndex ?? 0

  return(
    <BootstrapDialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="customized-dialog-title"
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpen(false)}>
        {isWin ? "Congrats Guardian!" : "Better Luck Tomorrow..."}
      </BootstrapDialogTitle>
      <DialogContent dividers sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center'}}>
        <Typography gutterBottom variant="h4" fontFamily="fantasy">
          {isWin ? "You got the word of the day: " + dailyWord : "The word of the day was: " + dailyWord}
        </Typography>
        <img style={{maxWidth:'80%', maxHeight:'80%'}} src={isWin ? winImg : loseImg} alt="win loss"/>
      </DialogContent>
      <DialogActions sx={{display: 'flex', justifyContent: "center"}}>
          <Button sx={{backgroundColor: '#1F1A24', color: 'white', fontFamily: 'fantasy', width: '200px', height: '50px', fontSize: "x-large"}} onClick={() => copyText(makeResultStr(counter, answers, dailyWord, isWin, dateIndex))}>
            Share Results
          </Button>
      </DialogActions>
    </BootstrapDialog>
  )
}

export default WLDialog
