import React from "react";

// Material
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Components
import AppBar from "components/AppBar";
import Drawer from "components/Drawer";
import MainContent from "components/MainContent";
import DeviceList from "./components/DeviceList";

// Styles
import useStyles from "./registeredDevices.styles";

const RegisteredDevices: React.FC = () => {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Drawer />
      <MainContent>
        <Paper className={classes.root}>
          <Typography variant="h4" color="primary">
            Devices Cadastrados
          </Typography>
          <DeviceList />
        </Paper>
      </MainContent>
    </Box>
  );
};

export { RegisteredDevices };
export default RegisteredDevices;
