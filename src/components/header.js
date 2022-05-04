import { AppBar, Typography } from '@mui/material';

const Header = () => {

  return(
    <AppBar position="static" sx={{ marginBottom: "75px" }}>
      <Typography noWrap="true" variant="h3" component="div" alignSelf="center" padding="5px" sx={{ flexGrow: 1 }} fontFamily="arial" fontWeight="bold">
        Derdle: A Destiny Word Game
      </Typography>
    </AppBar>
  )
}

export default Header
