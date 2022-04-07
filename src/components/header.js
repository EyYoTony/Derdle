import { AppBar, Typography } from '@mui/material';

const Header = () => {

  return(
    <AppBar position="static" sx={{ marginBottom: "75px" }}>
      <Typography variant="h3" component="div" alignSelf="center" padding="5px" sx={{ flexGrow: 1 }} fontFamily="fantasy">
        Destiny Word Game: Derdle
      </Typography>
    </AppBar>
  )
}

export default Header
