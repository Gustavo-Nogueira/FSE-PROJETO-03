import React from "react";

// Redux
import { useSelector } from "react-redux";

// Material
import Grid from "@material-ui/core/Grid";

// Components
import DeviceBox from "./components/DeviceBox";

// Types
import { ApplicationState } from "store";

// Styles
import useStyles from "./deviceList.styles";

interface DeviceListProps {}

type Props = DeviceListProps;

const DeviceList: React.FC<Props> = () => {
  const classes = useStyles();
  const devicesList = useSelector(
    (state: ApplicationState) => state.devices.devicesList
  );

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      className={classes.root}
    >
      <Grid item xs={10}>
        {devicesList.length > 0 &&
          devicesList.map((device) => (
            <DeviceBox key={device.id} deviceData={device} />
          ))}
      </Grid>
    </Grid>
  );
};

export { DeviceList };
export default DeviceList;
