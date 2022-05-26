import './App.css';
import { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { Fade, Button, Grid } from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
//components
import Header from './components/header.js'
import GameRow from './components/gameRow.js'
import WLDialog from './components/wlDialog.js'
// https://github.com/tabatkins/wordle-list/blob/main/words <- old wordlist for allowed words was missing some words that were common
// now useing this wordlist https://www.bestwordlist.com/5letterwords.htm
import allowedWordArr from './components/allowedWordArr.js'

//MAIN TODOS
//could do a help modal - explain game and reset time - low prio

// Mobile Todos
// Keyboard keys are small on mobile / keeps buttons pressed
// MAJOR - dialog modal not properly centered on mobile

export default function App() {

  //get todays current word
  //happens every time page updates, should be only when mounts
  const currentDate = new Date().getTime()
  const getModDay = (date) => {
    const dateStr = currentDate.toString()
    //you can subtract days to buffer to the wanted start date
    const dayBuffer = 6
    //the -14400 is to make the days flip over at midnight EST instead of UTC / one hour is 3600 seconds
    // use the day %30 to change the ansList position everyday / one day is 86400 seconds
    return Math.floor((((parseInt(dateStr.substring(0, dateStr.length-3))-14400)/86400)-dayBuffer)%30)
  }
  const dateIndex = getModDay(currentDate)

  //Make This change by time
  const ansList = ['petra', 'glint', 'class', 'saint', 'taken', 'power', 'salvo', 'tower', 'arath', 'cabal', 'ghost', 'crypt', 'titan', 'shank', 'botza', 'ketch', 'light', 'witch', 'earth', 'trust', 'crota', 'ikora', 'queen', 'armor', 'truth', 'quria', 'malok', 'sword', 'calus']
  const dailyWord = ansList[dateIndex].toUpperCase()

  //snackbar popups
  const { enqueueSnackbar } = useSnackbar();
  //state for toggleing Dialog -> needs to be passed down to component
  const [open, setOpen] = useState(false)
  const [isWin, setIsWin] = useState(false)
  //using hook to control state of input
  // I am probably doing a bad practice of changing the array instead of creating a new one with setAns at the current moment - would need to refactor a good amount of code to fix this so it is staying for the time being
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

  // EXAMPLE UPDATE AN OBJECT HOOK THROUGH A SETTER
  // setKbd({
  //   ...kbd,
  //   q: {bgc: "#ef9333", status: "none"}
  // })

  //ALLOWED KEYS FOR INPUT - A-Z lower and uppercasse
  const ALLOWED_KEYS = ['a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K', 'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z']

  var addLettter = (letter) => {
    if(inputState.length < 5 && !isWin){
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
          fontFamily: "arial",
          fontWeight: "bold",
          fontSize: "20px",
        }
      }
    });
  }

  //Logic for handling enter press - can open snackbar and dialog modals
  var handleEnter = () => {
    if(!isWin){
      if (inputState.length < 5 && counter <= 5){
        createSnackbar('Word Not Long Enough')
      }
      else if (inputState.length === 5){
        if(allowedWordArr.includes(inputState.toLowerCase())){
          //This is submission - row results are handled in gameRow.js based on counter
          //handle keyboard state on submit
          updateCookies()
          if(inputState.toUpperCase() === dailyWord.toUpperCase()){
            setIsWin(true)
            setOpen(true)
          }
          updateKeyboard(inputState, dailyWord)
          setCounter(counter+1)
          setInput("")
          if(counter >= 5){
            setOpen(true)
          }
        }
        else{
          createSnackbar("That's not a word")
        }
      }
      else{
        setOpen(true)
      }
    }
    else {
      //this should be the loss dialog modal
      setOpen(true)
    }
  }

  //logic for backspace press - remove from list of words and current Input
  var handleBackspace = () => {
    ans[counter] = ans[counter].substring(0, ans[counter].length-1)
    setInput(inputState.substring(0, inputState.length-1))
  }

  const updateKeyboard = (inWord, dw) =>{
    var updatedObj = kbd
    for(var i=0; i<inWord.length; i++){
      const myChar = inWord.toLowerCase().charAt(i)
      //don't update keyboard characters unless no status or appears
      if(kbd[myChar].status === "none"){
        if(!dw.toLowerCase().includes(myChar)){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#242526", status: "missing"}}
        }
        else if(dw.toLowerCase().charAt(i) === myChar){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#00b520", status: "correct"}}
        }
        else if(dw.toLowerCase().includes(myChar)){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#ef9333", status: "appears"}}
        }
      }
      else if(kbd[myChar].status === "appears"){
        if(dw.toLowerCase().charAt(i) === myChar){
          updatedObj = {...updatedObj, [myChar]: {bgc: "#00b520", status: "correct"}}
        }
      }
    }
    //can only update the object all at once, tried to do this one key at a time and it only updated last char in inWord
    setKbd(updatedObj)
  }

  //cookie implementation here -> will use previous states
  //needs dateIndex, isWin, ans, ----kbd----, counter?
  //kdb can be updated from ans data so dont need as cookie // counter/isWin can be found from ans as well might be easier to store
  //update cookie whenever useEffect is triggered
  //import cookie data when dateIndex of page is same as cookie onPageLoad, if the dateIndex != page/cookie then set cookie null (edge case user returns after 30 days to same puzzle)
  //we doing manual cookies for now but a library would probably be better in the long run
  //used to maybe load state from cookies on page load
  const [isLoaded, setIsLoaded] = useState(false)
  //cookie parser - from this article https://medium.com/swlh/react-hooks-usecookie-hook-26ac06ff36b0
  const getItem = key =>
    document.cookie.split("; ").reduce((total, currentCookie) => {
       const item = currentCookie.split("=");
       const storedKey = item[0];
       const storedValue = item[1];
       return key === storedKey
         ? decodeURIComponent(storedValue)
         : total;
    }, '');

  //will only update cookies on sucessful handleEnter()
  const updateCookies = () => {
    //var midnight = new Date();
    //this might be local midnight and not EST midnight which is different from the Unix Time Stamp I am using
    //midnight.setHours(23,59,59,0);
    const hoursRemain = (86400000-((currentDate-14400000)%86400000))
    const expireDate = new Date(currentDate-14400000+hoursRemain)
    //document.cookie = 'name=hellcookies2; dateIndex='+dateIndex +'; expires='+ midnight.toUTCString()+';'
    document.cookie = 'dateIndex='+dateIndex+'; expires='+ expireDate.toUTCString()+';'
    //changing the ans array to a obj because it is easier to pasrse json from a string, using an array was a bad design decision
    document.cookie = 'ans='+JSON.stringify({0: ans[0], 1: ans[1], 2: ans[2], 3: ans[3] ,4: ans[4], 5: ans[5]})+'; expires='+ expireDate.toUTCString()+';'
  }

  //This should only happen on page load and needs to be loaded as stated above
  const updateStateFromCookies = () => {
    // const myKbd = getItem('kbd')
    // if(myKbd !== undefined){
    //   setKbd(JSON.parse(myKbd))
    // }
    const cookieIndex = parseInt(getItem('dateIndex'))
    //if the main cookie exists
    if(!isNaN(cookieIndex)){
      if(cookieIndex === dateIndex){
        //UPDATE STATE FROM COOKIES HERE
        const ansObj = JSON.parse(getItem('ans'))
        //do logic on ans to find counter, isWin, and kbd
        const updatedArr = ["", "", "", "", "", ""]
        var updatedCounter = 0
        var updatedIsWin = false
        var updatedKeyboard = {
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
        }
        for(var i=0; i<6; i++){
          //short the loop
          if(ansObj[i] === ""){
            i=6
          }
          else{
            updatedArr[i] = ansObj[i]
            updatedCounter++
          }
        }
        if(updatedArr[updatedCounter-1].toLowerCase() === dailyWord.toLowerCase())
          updatedIsWin = true
        setAns(updatedArr)
        setCounter(updatedCounter)
        setIsWin(updatedIsWin)
        //update kbd
        for(var j=0; j<updatedCounter; j++){
          //from updatekbd
          for(var i=0; i<updatedArr[j].length; i++){
            const myChar = updatedArr[j].toLowerCase().charAt(i)
            //don't update keyboard characters unless no status or appears
            if(kbd[myChar].status === "none"){
              if(!dailyWord.toLowerCase().includes(myChar)){
                updatedKeyboard = {...updatedKeyboard, [myChar]: {bgc: "#242526", status: "missing"}}
              }
              else if(dailyWord.toLowerCase().charAt(i) === myChar){
                updatedKeyboard = {...updatedKeyboard, [myChar]: {bgc: "#00b520", status: "correct"}}
              }
              else if(dailyWord.toLowerCase().includes(myChar)){
                updatedKeyboard = {...updatedKeyboard, [myChar]: {bgc: "#ef9333", status: "appears"}}
              }
            }
            else if(kbd[myChar].status === "appears"){
              if(dailyWord.toLowerCase().charAt(i) === myChar){
                updatedKeyboard = {...updatedKeyboard, [myChar]: {bgc: "#00b520", status: "correct"}}
              }
            }
          }

        }
        setKbd(updatedKeyboard)
      }
      else{
        //DELETE ALL CURRENT COOKIES

      }
    }
  }


  //handle keypress
  useEffect(() => {
      //an old componentDidMount by using hook
      if(!isLoaded){
        setIsLoaded(true)
        updateStateFromCookies()
      }

      const listener = e => {
        e.preventDefault();
        if(!e.repeat){
          //const hoursRemain = 86400000-((currentDate-14400000)%86400000)
          //console.log(new Date(currentDate-14400000+hoursRemain).toUTCString())
          if(e.code === "Backspace"){
            handleBackspace()
          }
          else if(e.code === "Enter"){
            if(!isWin){
              handleEnter()
            }
            else {
              //if enter is pressed during a win state
              //this opens the end dialog modal
              setOpen(true)
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
      <WLDialog open={open} setOpen={setOpen} isWin={isWin} answers={ans} counter={counter} dailyWord={dailyWord} dateIndex={dateIndex} createSnackbar={createSnackbar}/>
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
              <Button variant="contained" sx={{backgroundColor: kbd.enter.bgc}} onClick={handleEnter}>
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
              <Button variant="contained" sx={{backgroundColor: kbd.back.bgc}} onClick={handleBackspace} startIcon={<KeyboardBackspaceIcon />}> Back </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
