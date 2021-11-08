import React from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

// Material
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

// Icons
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

// Components
import DrawerBase from "./components/DrawerBase";
import PageListItems from "./components/PageListItems";

// Actions
import * as DrawerActions from "store/drawer/actions";

// Types
import { ApplicationState } from "store";

interface DrawerProps {}

type Props = DrawerProps;

const Drawer: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const open = useSelector((state: ApplicationState) => state.drawer.open);

  const toggleDrawer = () => {
    dispatch(DrawerActions.setOpenDrawer({ open: !open }));
  };

  return (
    <DrawerBase variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        <PageListItems />
      </List>
      <Divider />
      {/* <List>{secondaryListItems}</List> */}
    </DrawerBase>
  );
};

export { Drawer };
export default Drawer;
