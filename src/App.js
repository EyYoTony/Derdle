import './App.css';
import { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { Fade, Button, Grid, IconButton } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
//components
import Header from './components/header.js'
import GameRow from './components/gameRow.js'
import WLDialog from './components/wlDialog.js'
// https://github.com/tabatkins/wordle-list/blob/main/words now using this wordlist for allowed words
import allowedWordArr from './components/allowedWordArr.js'

//MAIN TODOS
//USE UNIX TIMESTAMP TO CHANGE THE WORD EVERYDAY
//IMPLEMENT MODAL FOR WIN / LOSS (could do a help modal as well)
//^ add Sharing capabilities
//add functionality to back and enter onscreen buttons
//change button typeface to fantasy and increase font size ???? do I even want want this ???
// last thing - save attempts/state to cookies
//  easy thing - work on warnings in cmd

export default function App() {
  //snackbar popups
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  //state for toggleing Dialog -> needs to be passed down to component
  const [open, setOpen] = useState(false)
  const [isWin, setIsWin] = useState(false)
  //using hook to control state of input
  // I am probably doing a bad practice of changing the array instead of creating a new one with setAns at the current moment
  const [ans, setAns] = useState(["", "", "", "", "", ""])
  //keyboard state
  const [kbd, setKbd] = useState({
    a: {bgc: "#686868", status: "none"},
    b: {bgc: "#686868", status: "none"},
    c: {bgc: "#686868", status: "none"},
    d: {bgc: "#686868", status: "none"},
    e: {bgc: "#686868", status: "none"},
    f: {bgc: "#686868", status: "none"},
    g: {bgc: "#686868", status: "none"},
    h: {bgc: "#686868", status: "none"},
    i: {bgc: "#686868", status: "none"},
    j: {bgc: "#686868", status: "none"},
    k: {bgc: "#686868", status: "none"},
    l: {bgc: "#686868", status: "none"},
    m: {bgc: "#686868", status: "none"},
    n: {bgc: "#686868", status: "none"},
    o: {bgc: "#686868", status: "none"},
    p: {bgc: "#686868", status: "none"},
    q: {bgc: "#686868", status: "none"},
    r: {bgc: "#686868", status: "none"},
    s: {bgc: "#686868", status: "none"},
    t: {bgc: "#686868", status: "none"},
    u: {bgc: "#686868", status: "none"},
    v: {bgc: "#686868", status: "none"},
    w: {bgc: "#686868", status: "none"},
    x: {bgc: "#686868", status: "none"},
    y: {bgc: "#686868", status: "none"},
    z: {bgc: "#686868", status: "none"},
    enter: {bgc: "#686868", status: "none"},
    back: {bgc: "#686868", status: "none"},
  })
  //^ this is the proper way to do state as object / do this instead of array like I did with input

  //The inputState will always reflect the current user guess
  const [inputState, setInput] = useState("")
  //counter to know what line to edit
  const [counter, setCounter] = useState(0)

  //get todays current word
  //const currentDate = new Date().getTime()
  //console.log(currentDate)

  // setKbd({
  //   ...kbd,
  //   q: {bgc: "#ef9333", status: "none"}
  // })

  //ALLOWED KEYS FOR INPUT - A-Z lower and uppercasse
  const ALLOWED_KEYS = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z']
  const dailyWord = "GHOST"

  var addLettter = (letter) => {
    if(inputState.length < 5){
      ans[counter] = (inputState + letter)
      setInput(inputState + letter)
    }
  }

  //main snackbar logic here - now a function
  var createSnackbar = (message) => {
    enqueueSnackbar(message, {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
      TransitionComponent: Fade,
      autoHideDuration: 1250,
      // thanks for this blog post - https://smartdevpreneur.com/customizing-notistack-with-material-ui-snackbar/
      sx: {
        "& .SnackbarContent-root": {
          color: "white",
          backgroundColor: "#1F1A24",
          justifyContent: "center",
          fontFamily: "fantasy",
          fontSize: "20px",
        }
      }
    });
  }

  const updateKeyboard = (inWord, dw) =>{
    var updatedObj = kbd
    for(var i=0; i<inWord.length; i++){
      const myChar = inWord.toLowerCase().charAt(i)
      //don't update keyboard characters unless no status or appears
      if(kbd[myChar].status == "none"){
        if(!dw.toLowerCase().includes(myChar)){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#242526", status: "missing"}}
        }
        else if(dw.toLowerCase().charAt(i) == myChar){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#00b520", status: "correct"}}
        }
        else if(dw.toLowerCase().includes(myChar)){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#ef9333", status: "appears"}}
        }
      }
      else if(kbd[myChar].status == "appears"){
        if(dw.toLowerCase().charAt(i) == myChar){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#00b520", status: "correct"}}
        }
      }
    }
    //can only update the object all at once, tried to do this one key at a time and it only updated last char in inWord
    setKbd(updatedObj)
  }

  //handle keypress
  useEffect(() => {

      const listener = e => {
        e.preventDefault();
        if(!e.repeat){
          if(e.code == "Backspace"){
            ans[counter] = ans[counter].substring(0, ans[counter].length-1)
            setInput(inputState.substring(0, inputState.length-1))
          }
          else if(e.code == "Enter"){
            if (inputState.length < 5 && counter <= 5){
              console.log(counter)
              createSnackbar('Word Not Long Enough')
            }
            else if (inputState.length == 5){
              if(allowedWordArr.includes(inputState)){
                //This is submission - row results are handled in gameRow.js based on counter
                //handle keyboard state on submit
                if(inputState == dailyWord)
                  setIsWin(true)
                updateKeyboard(inputState, dailyWord)
                setCounter(counter+1)
                setInput("")
              }
              else{
                createSnackbar("That's not a word")
              }
            }
            else {
              //use this as a exmple for custom snackbar popups
              createSnackbar("open modal")
            }

          }
          else if(inputState.length < 5 && ALLOWED_KEYS.includes(e.key)){
            addLettter(e.key)
          }
        }

      };

      document.addEventListener('keydown', listener)
      return () => {
        document.removeEventListener('keydown', listener)
      }
  })

  //TODO clean up grid item buttons by making them programatically (low prio / it's always spaghetti)
  return (
    <div className="main">
      <Header />
      <WLDialog open={open} setOpen={setOpen} isWin={isWin} />
      <div className="game">
          <GameRow input={ans[0]} isSubmitted={counter > 0} dailyWord={dailyWord}/>
          <GameRow input={ans[1]} isSubmitted={counter > 1} dailyWord={dailyWord}/>
          <GameRow input={ans[2]} isSubmitted={counter > 2} dailyWord={dailyWord}/>
          <GameRow input={ans[3]} isSubmitted={counter > 3} dailyWord={dailyWord}/>
          <GameRow input={ans[4]} isSubmitted={counter > 4} dailyWord={dailyWord}/>
          <GameRow input={ans[5]} isSubmitted={counter > 5} dailyWord={dailyWord}/>
      </div>
      <Grid container paddingTop="100px" spacing={1} direction="column" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="flex-end">
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.q.bgc}} onClick={() => addLettter("Q")}> Q </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.w.bgc}} onClick={() => addLettter("W")}> W </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.e.bgc}} onClick={() => addLettter("E")}> E </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.r.bgc}} onClick={() => addLettter("R")}> R </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.t.bgc}} onClick={() => addLettter("T")}> T </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.y.bgc}} onClick={() => addLettter("Y")}> Y </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.u.bgc}} onClick={() => addLettter("U")}> U </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.i.bgc}} onClick={() => addLettter("I")}> I </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.o.bgc}} onClick={() => addLettter("O")}> O </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.p.bgc}} onClick={() => addLettter("P")}> P </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="flex-end">
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.a.bgc}} onClick={() => addLettter("A")}> A </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.s.bgc}} onClick={() => addLettter("S")}> S </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.d.bgc}} onClick={() => addLettter("D")}> D </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.f.bgc}} onClick={() => addLettter("F")}> F </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.g.bgc}} onClick={() => addLettter("G")}> G </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.h.bgc}} onClick={() => addLettter("H")}> H </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.j.bgc}} onClick={() => addLettter("J")}> J </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.k.bgc}} onClick={() => addLettter("K")}> K </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.l.bgc}} onClick={() => addLettter("L")}> L </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="flex-end">
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.enter.bgc}} onClick={() => {console.log("enter")}}>
                 Enter
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.z.bgc}} onClick={() => addLettter("Z")}> Z </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.x.bgc}} onClick={() => addLettter("X")}> X </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.c.bgc}} onClick={() => addLettter("C")}> C </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.v.bgc}} onClick={() => addLettter("V")}> V </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.b.bgc}} onClick={() => addLettter("B")}> B </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.n.bgc}} onClick={() => addLettter("N")}> N </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.m.bgc}} onClick={() => addLettter("M")}> M </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{backgroundColor: kbd.back.bgc}} onClick={() => {console.log("back")}} startIcon={<KeyboardBackspaceIcon />}> Back </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
