import { Box, Paper, Typography } from '@mui/material';

const GameSquare = (props) => {
  const result = props.result || "none"
  const letter = props.letter || ""
  //select background color from result page-bg #121212 missing #686868 appears #ef9333 correct #00b520
  const bgc = (result == "none")
    ? "#121212"
    : (result == "correct")
    ? "#00b520"
    : (result == "appears")
    ? "#ef9333"
    : "#242526"

  return(
    <Box sx={{
        width: 64,
        height: 64,
        borderRadius: 2,
        backgroundColor: bgc,
        border: 1,
        margin: '5px',
        borderColor: "white",
      }}>
      <Typography color="white" variant="h3" align="center" padding="5px" sx={{ flexGrow: 1 }} fontFamily="fantasy">
        {letter}
      </Typography>
    </Box>
  )
}

export default GameSquare
