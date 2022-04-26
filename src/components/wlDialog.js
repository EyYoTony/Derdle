// This is the pop up dialog modal for Win/Loss/Share handleing
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'

const WLDialog = (props) => {
  // I should have been using nullish operator instead of logical OR in other components probably
  const open = props.open ?? false
  const setOpen = props.setOpen
  const isWin = props.isWin ?? false

  return(
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
    >
      <DialogTitle>
        HELLO SEATTLE
      </DialogTitle>
    </Dialog>
  )
}

export default WLDialog
