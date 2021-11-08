import * as React from "react";

// Material
import { styled } from "@material-ui/core/styles";
import MuiAppBar, {
  AppBarProps as MuiAppBarProps,
} from "@material-ui/core/AppBar";

// Constants
import DRAWER_CONSTANTS from "constants/drawer";

interface AppBarBaseProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarBase = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarBaseProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_CONSTANTS.DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_CONSTANTS.DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export { AppBarBase };
export default AppBarBase;
