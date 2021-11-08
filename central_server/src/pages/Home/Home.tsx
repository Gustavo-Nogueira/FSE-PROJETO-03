import React from "react";

// Material
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// Components
import AppBar from "components/AppBar";
import Drawer from "components/Drawer";
import MainContent from "components/MainContent";

// Styles
import useStyles from "./home.styles";

const Home: React.FC = () => {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Drawer />
      <MainContent>
        <Paper className={classes.root}>
          <Typography variant="h4" color="primary">
            Home
          </Typography>
        </Paper>
      </MainContent>
    </Box>
  );
};

export { Home };
export default Home;
