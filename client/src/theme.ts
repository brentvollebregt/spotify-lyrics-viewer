import { createMuiTheme } from "@material-ui/core/styles";

const getTheme = (isDark: boolean) => {
  if (isDark) {
    return createMuiTheme({});
  } else {
    return createMuiTheme({});
  }
};

export default getTheme;
