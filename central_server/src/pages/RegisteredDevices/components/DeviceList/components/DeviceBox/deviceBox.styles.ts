import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => {
  const theme = useTheme();
  return {
    device: {
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
      borderRadius: 10,
      padding: theme.spacing(2),
    },
    temperature: {
      color: "#FFCD57",
    },
    humidity: {
      color: "#5195FC",
    },
    deviceIO: {
      padding: theme.spacing(0.5),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      border: "1px solid rgba(0, 0, 0, 0.12)",
      borderRadius: 5,
    },
    deviceIOTitle: {
      padding: theme.spacing(0.5),
    },
  };
});

export default useStyles;
