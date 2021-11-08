import React from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Material
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";

// Components
import AppBarBase from "./components/AppBarBase";

// Actions
import * as DrawerActions from "store/drawer/actions";

// Types
import { ApplicationState } from "store";

interface AppBarProps {}

type Props = AppBarProps;

const AppBar: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: ApplicationState) => state.drawer.open);

  const toggleDrawer = () => {
    dispatch(DrawerActions.setOpenDrawer({ open: !open }));
  };

  return (
    <AppBarBase position="absolute" open={open}>
      <Toolbar sx={{ pr: "24px" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: "36px",
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>
      </Toolbar>
    </AppBarBase>
  );
};

export { AppBar };
export default AppBar;
