import './App.css';
import { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { Fade, Button, Grid, IconButton } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
//components
import Header from './components/header.js'
import GameRow from './components/gameRow.js'

//MAIN TODOS
//USE UNIX TIMESTAMP TO CHANGE THE WORD EVERYDAY
//IMPLEMENT MODAL FOR WIN / LOSS (could do a help modal as well)
//MAKE KEYBOARD REFLECT CURRENT PLAYER INPUT INFO (use state)
//ONLY ALLOW WORDS IN WORDLIST back one directory
//change button typeface to fantasy and increase font size

export default function App() {

  //snackbar popups
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //using hook to control state of input
  // I am probably doing a bad practice of changing the array instead of creating a new one with setAns at teh current moment
  const [ans, setAns] = useState(["", "", "", "", "", ""])
  //The inputState will always reflect the current user guess
  const [inputState, setInput] = useState("")
  //counter to know what line to edit
  const [counter, setCounter] = useState(0)

  //get todays current word
  //const currentDate = new Date().getTime()
  //console.log(currentDate)

  //ALLOWED KEYS FOR INPUT - A-Z lower and uppercasse
  const ALLOWED_KEYS = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z']

  var addLettter = (letter) => {
    if(inputState.length < 5){
      ans[counter] = (inputState + letter)
      setInput(inputState + letter)
    }
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
              //main snackbar logic here
              enqueueSnackbar('Word Not Long Enough', {
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
            else if (inputState.length == 5){
              setCounter(counter+1)
              setInput("")
            }
            else {
              //use this as a exmple for custom snackbar popups
              enqueueSnackbar('Word Not Valid', {
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
      <div className="game">
          <GameRow input={ans[0]} isSubmitted={counter > 0} />
          <GameRow input={ans[1]} isSubmitted={counter > 1} />
          <GameRow input={ans[2]} isSubmitted={counter > 2} />
          <GameRow input={ans[3]} isSubmitted={counter > 3} />
          <GameRow input={ans[4]} isSubmitted={counter > 4} />
          <GameRow input={ans[5]} isSubmitted={counter > 5} />
      </div>
      <Grid container paddingTop="100px" spacing={1} direction="column" justifyContent="space-between" alignItems="center">
        <Grid item>
          <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="flex-end">
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("Q")}> Q </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("W")}> W </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("E")}> E </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("R")}> R </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("T")}> T </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("Y")}> Y </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("U")}> U </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("I")}> I </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("O")}> O </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("P")}> P </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="flex-end">
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("A")}> A </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("S")}> S </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("D")}> D </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("F")}> F </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("G")}> G </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("H")}> H </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("J")}> J </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("K")}> K </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("L")}> L </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={0.5} direction="row" justifyContent="center" alignItems="flex-end">
            <Grid item>
              <Button variant="contained" color="success" onClick={() => {console.log("back")}}>
                 Enter
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("Z")}> Z </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("X")}> X </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("C")}> C </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("V")}> V </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("B")}> B </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("N")}> N </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => addLettter("M")}> M </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="success" onClick={() => {console.log("back")}} startIcon={<KeyboardBackspaceIcon />}> Back </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
