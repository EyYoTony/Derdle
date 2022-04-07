import { createTheme } from "@material-ui/core/styles"

const myTheme = createTheme({
  root: {
    display: "flex",
  },
  palette: {
    primary: {
      main: "#121212",
    },
  },
  typography: {
    fontFamily: "Lato, Arial",
    fontSize: 12,
    h1: {
      fontFamily: "Lato, Arial",
      fontSize: 30,
      fontWeight: 700,
    },
    h2: {
      fontFamily: "Lato, Arial",
      fontSize: 20,
      fontWeight: 700,
      paddingBottom: 20,
    },
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#662E9B",
      },
    },
  },
});

export default createTheme(myTheme);
