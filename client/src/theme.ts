import { createMuiTheme } from "@material-ui/core/styles";

const getTheme = (isDark: boolean) => {
  if (isDark) {
    return createMuiTheme({
      palette: {
        type: "dark"
      }
    });
  } else {
    return createMuiTheme({
      palette: {
        type: "light"
      }
    });
  }
};

export default getTheme;
