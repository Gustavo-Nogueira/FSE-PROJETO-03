import React from "react";

// Material
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Components
import AppBar from "components/AppBar";
import Drawer from "components/Drawer";
import MainContent from "components/MainContent";
import TableDevices from "./components/TableDevices";

// Styles
import useStyles from "./unregisteredDevices.styles";

const UnregisteredDevices: React.FC = () => {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Drawer />
      <MainContent>
        <Paper className={classes.root}>
          <Typography variant="h4" color="primary">
            Devices Não Cadastrados
          </Typography>
          <TableDevices />
        </Paper>
      </MainContent>
    </Box>
  );
};

export { UnregisteredDevices };
export default UnregisteredDevices;
