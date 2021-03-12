import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

const getTheme = (isDark: boolean) => {
  if (isDark) {
    return createMuiTheme({
      palette: {
        type: "dark",
        primary: {
          main: green[500]
        }
      }
    });
  } else {
    return createMuiTheme({
      palette: {
        type: "light",
        primary: {
          main: green[800]
        }
      }
    });
  }
};

export default getTheme;
