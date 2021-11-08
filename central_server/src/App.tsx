import React, { useEffect } from "react";

// Redux
import store from "store";
import { useDispatch } from "react-redux";

// MQTT
import mqtt from "mqtt";

// React Router Dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import Home from "pages/Home";
import ApplicationLogs from "pages/ApplicationLogs";
import RegisteredDevices from "pages/RegisteredDevices";
import UnregisteredDevices from "pages/UnregisteredDevices";

// Material
import CssBaseline from "@material-ui/core/CssBaseline";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";

// Actions
import * as DeciveActions from "store/devices/actions";

// Constants
import PATHS from "constants/paths";
import MQTT_CONSTANTS from "constants/mqtt";

export const mqttClient = mqtt.connect(MQTT_CONSTANTS.MOSQUITTO_BROKER_URL);

// Theme
const theme = createTheme();

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    mqttClient.on("connect", () => {
      mqttClient.subscribe(MQTT_CONSTANTS.TOPICS.CONFIG);
      mqttClient.subscribe(MQTT_CONSTANTS.TOPICS.STATE);
      mqttClient.subscribe(MQTT_CONSTANTS.TOPICS.HUMIDITY);
      mqttClient.subscribe(MQTT_CONSTANTS.TOPICS.TEMPERATURE);
    });

    mqttClient.on("message", (topic, message) => {
      const { data, command } = JSON.parse(message.toString());
      const { devicesList, unregisteredDevicesList } = store.getState().devices;

      if (command === MQTT_CONSTANTS.COMMANDS.DEVICE_INIT) {
        const index = unregisteredDevicesList.findIndex(
          (d) => d.id === data.device_id
        );

        if (index < 0) {
          store.dispatch(
            DeciveActions.setUnregisteredDevicesList({
              devicesList: [
                ...unregisteredDevicesList,
                {
                  id: data.device_id,
                  mode: data.mode,
                  updatedAt: new Date().toLocaleString(),
                },
              ],
            })
          );
        } else {
          store.dispatch(
            DeciveActions.setUnregisteredDevicesList({
              devicesList: unregisteredDevicesList.map((d, i) => ({
                ...d,
                updatedAt:
                  index === i ? new Date().toLocaleString() : d.updatedAt,
              })),
            })
          );
        }
      }

      if (command === MQTT_CONSTANTS.COMMANDS.INPUT_PUSH_NOTIFICATION) {
        if (data) {
          const index = devicesList.findIndex((d) => d.id === data.device_id);
          if (index < 0) return;

          dispatch(
            DeciveActions.setDevicesList({
              devicesList: devicesList.map((d, i) => ({
                ...d,
                input: {
                  ...d.input,
                  updatedAt:
                    i === index
                      ? new Date().toLocaleString()
                      : d.input.updatedAt,
                },
                updatedAt:
                  i === index ? new Date().toLocaleString() : d.updatedAt,
              })),
            })
          );
        }
      }

      if (command === MQTT_CONSTANTS.COMMANDS.OUTPUT_PUSH_NOTIFICATION) {
        const index = devicesList.findIndex((d) => d.id === data.device_id);
        if (index < 0) return;

        dispatch(
          DeciveActions.setDevicesList({
            devicesList: devicesList.map((d, i) => ({
              ...d,
              output: {
                ...d.output,
                value: i === index ? data.value : d.output.value,
              },
              updatedAt:
                i === index ? new Date().toLocaleString() : d.updatedAt,
            })),
          })
        );
      }

      if (command === MQTT_CONSTANTS.COMMANDS.CMD_TEMPERATURE_UPDATE) {
        const index = devicesList.findIndex((d) => d.id === data.device_id);
        if (index < 0) return;

        dispatch(
          DeciveActions.setDevicesList({
            devicesList: devicesList.map((d, i) => ({
              ...d,
              temperature: i === index ? data.temperature : d.temperature,
              updatedAt:
                i === index ? new Date().toLocaleString() : d.updatedAt,
            })),
          })
        );
      }

      if (command === MQTT_CONSTANTS.COMMANDS.CMD_HUMIDITY_UPDATE) {
        const index = devicesList.findIndex((d) => d.id === data.device_id);
        if (index < 0) return;

        dispatch(
          DeciveActions.setDevicesList({
            devicesList: devicesList.map((d, i) => ({
              ...d,
              humidity: i === index ? data.humidity : d.humidity,
              updatedAt:
                i === index ? new Date().toLocaleString() : d.updatedAt,
            })),
          })
        );
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path={PATHS.HOME} render={() => <Home />} />
          <Route exact path={PATHS.LOGS} render={() => <ApplicationLogs />} />
          <Route
            exact
            path={PATHS.REGISTERED_DEVICES}
            render={() => <RegisteredDevices />}
          />
          <Route
            exact
            path={PATHS.UNREGISTERED_DEVICES}
            render={() => <UnregisteredDevices />}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
