import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    root: {
      padding: theme.spacing(2),
    },
  };
});

export default useStyles;
