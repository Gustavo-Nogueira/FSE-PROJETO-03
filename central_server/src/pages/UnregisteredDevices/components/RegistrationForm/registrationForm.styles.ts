import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    formGrid: {
      padding: theme.spacing(0.5),
    },
  };
});

export default useStyles;
