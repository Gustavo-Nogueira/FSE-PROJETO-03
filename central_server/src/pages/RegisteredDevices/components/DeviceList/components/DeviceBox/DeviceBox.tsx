import React from "react";

// Redux
import store from "store";

// MQTT
import { mqttClient } from "App";

// Material
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Slider from "@material-ui/core/Slider";

// Material Design Icons
import Icon from "@mdi/react";
import { mdiRestart } from "@mdi/js";

// lodash
import { debounce } from "lodash";

// Actions
import * as DeciveActions from "store/devices/actions";

// Constants
import MQTT_CONSTANTS from "constants/mqtt";
import { DEVICE_CONSTANTS_OBJ } from "constants/devices";

// Types
import { DeviceInterface } from "store/devices/types";

// Styles
import useStyles from "./deviceBox.styles";

interface DeviceBoxProps {
  deviceData: DeviceInterface;
}

type Props = DeviceBoxProps;

const DeviceBox: React.FC<Props> = ({ deviceData }) => {
  const classes = useStyles();

  const [switchState, setSwitchState] = React.useState(false);
  const [sliderState, setSliderState] = React.useState(0);

  React.useEffect(() => {
    const { type, value } = deviceData.output;
    if (type === DEVICE_CONSTANTS_OBJ.OUTPUT_TYPES.BINARY.KEY) {
      setSwitchState(Boolean(value));
    }
    if (type === DEVICE_CONSTANTS_OBJ.OUTPUT_TYPES.DIMMABLE.KEY) {
      setSliderState(Math.round((value * 100) / 256));
    }
  }, [deviceData]);

  const debouncedPublish = React.useMemo(
    () =>
      debounce((value: number) => {
        const topic = `${MQTT_CONSTANTS.TOPICS.DEVICE}/${deviceData.id}`;

        const json = {
          command: MQTT_CONSTANTS.COMMANDS.SET_OUTPUT_VALUE,
          msg_id: 2,
          response_topic: MQTT_CONSTANTS.TOPICS.RESPONSES,
          data: {
            value,
          },
        };

        mqttClient.publish(topic, JSON.stringify(json));
      }, 500),
    []
  );

  const handleSwitchChange = () => {
    setSwitchState(!switchState);
    debouncedPublish(!switchState ? 1 : 0);
  };

  const handleSliderChange = (value: number) => {
    setSliderState(value);
    debouncedPublish(Math.round((value * 256) / 100));
  };

  const handleReset = () => {
    const topic = `${MQTT_CONSTANTS.TOPICS.DEVICE}/${deviceData.id}`;
    const json = {
      command: MQTT_CONSTANTS.COMMANDS.RESET_DEVICE,
      msg_id: 3,
      response_topic: MQTT_CONSTANTS.TOPICS.RESPONSES,
    };

    const devicesList = [...store.getState().devices.devicesList];
    const index = devicesList.findIndex((d) => d.id === deviceData.id);
    if (index >= 0) devicesList.splice(index, 1);
    store.dispatch(DeciveActions.setDevicesList({ devicesList }));

    mqttClient.publish(topic, JSON.stringify(json));
  };

  return (
    <Box className={classes.device}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" color="primary">
                {deviceData.name}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton title="Resetar Device" onClick={() => handleReset()}>
                <Icon path={mdiRestart} size={1.1} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-around">
            <Grid item>
              <Typography
                align="center"
                fontSize="1.15rem"
                className={classes.temperature}
              >
                Temperatura
                <Typography fontWeight="bold">{`${deviceData.temperature}°C`}</Typography>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                align="center"
                fontSize="1.15rem"
                className={classes.humidity}
              >
                Umidade
                <Typography fontWeight="bold">{`${deviceData.humidity}%`}</Typography>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="space-around">
            <Grid item xs={4}>
              <Box className={classes.deviceIO} minHeight={180}>
                <Typography align="center" color="primary">
                  Entrada
                </Typography>
                <Divider />
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography className={classes.deviceIOTitle}>
                      {deviceData.input.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Typography align="center">
                          Última notificação:
                          <Typography>{deviceData.input.updatedAt}</Typography>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} />
                      <Grid item>
                        <FormControl component="fieldset">
                          <FormGroup row>
                            <FormControlLabel
                              value="end"
                              label="Alarme"
                              labelPlacement="end"
                              control={
                                <Checkbox
                                  disabled
                                  checked={deviceData.input.isAlarm}
                                />
                              }
                            />
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box className={classes.deviceIO} minHeight={180}>
                <Typography align="center" color="primary">
                  Saída
                </Typography>
                <Divider />
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography className={classes.deviceIOTitle}>
                      {deviceData.output.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="center">
                      <Grid item>
                        <Typography align="center">
                          Estado:{" "}
                          {deviceData.output.type ===
                            DEVICE_CONSTANTS_OBJ.OUTPUT_TYPES.BINARY.KEY &&
                            (Boolean(deviceData.output.value) ? "On" : "Off")}
                          {deviceData.output.type ===
                            DEVICE_CONSTANTS_OBJ.OUTPUT_TYPES.DIMMABLE.KEY &&
                            `${Math.round(
                              (deviceData.output.value * 100) / 256
                            )}%`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} />
                      {deviceData.output.type ===
                        DEVICE_CONSTANTS_OBJ.OUTPUT_TYPES.BINARY.KEY && (
                        <Grid item>
                          <Typography component="span">Off</Typography>
                          <Switch
                            checked={switchState}
                            onChange={() => handleSwitchChange()}
                          />
                          <Typography component="span">On</Typography>
                        </Grid>
                      )}
                      {deviceData.output.type ===
                        DEVICE_CONSTANTS_OBJ.OUTPUT_TYPES.DIMMABLE.KEY && (
                        <Grid item>
                          <Box sx={{ width: 120 }}>
                            <Slider
                              value={sliderState}
                              valueLabelDisplay="auto"
                              step={10}
                              marks
                              min={0}
                              max={100}
                              onChange={(_, v) =>
                                handleSliderChange(v as number)
                              }
                            />
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="flex-end">
            <Typography> Última atualização:{deviceData.updatedAt}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export { DeviceBox };
export default DeviceBox;
