// This is the pop up dialog modal for Win/Loss/Share handleing
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
import winImg from '../resources/CaydeThumbsUp.png'
import loseImg from '../resources/UldrenNo.png'

//TODOS
// BIG ONE copy to clipboard results

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



const WLDialog = (props) => {
  // I should have been using nullish operator instead of logical OR in other components probably
  const open = props.open ?? false
  const setOpen = props.setOpen
  const isWin = props.isWin ?? false
  //TODO copy posta logic from ROW to copy results to clipboard
  const answers = props.answers ?? []
  const dailyWord = "ghost".toUpperCase()

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
        <img style={{maxWidth:'80%', maxHeight:'80%'}} src={isWin ? winImg : loseImg}/>
      </DialogContent>
      <DialogActions sx={{display: 'flex', justifyContent: "center"}}>
          <Button sx={{backgroundColor: '#1F1A24', color: 'white', fontFamily: 'fantasy', width: '200px', height: '50px', fontSize: "x-large"}} onClick={() => {}}>
            Share Results
          </Button>
      </DialogActions>
    </BootstrapDialog>
  )
}

export default WLDialog
