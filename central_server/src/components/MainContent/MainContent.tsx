import React from "react";

// Material
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";

interface MainContentProps {}

type Props = MainContentProps;

const MainContent: React.FC<Props> = ({ children }) => {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export { MainContent };
export default MainContent;
