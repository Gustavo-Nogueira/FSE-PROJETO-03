import * as React from "react";

// Redux
import store from "store";
import { useHistory } from "react-router-dom";

// MQTT
import { mqttClient } from "App";

// Formik
import { useFormik } from "formik";

// Material
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

// Constants
import PATHS from "constants/paths";
import MQTT_CONSTANTS from "constants/mqtt";
import DEVICE_CONSTANTS from "constants/devices";

// Actions
import * as DeciveActions from "store/devices/actions";

// Types
import { UnregisteredDeviceInterface } from "store/devices/types";

// Styles
import useStyles from "./registrationForm.styles";

interface RegistrationFormProps {
  open: boolean;
  handleClose: () => void;
  deviceData: UnregisteredDeviceInterface | null;
}

type Props = RegistrationFormProps;

const RegistrationForm: React.FC<Props> = ({
  open,
  handleClose,
  deviceData,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      id: "",
      name: "",
      type: 1,
      input: {
        name: "",
        type: 1,
        isAlarm: false,
      },
      output: {
        name: "",
        type: 1,
      },
    },
    // validationSchema: {},
    onSubmit: (values) => {
      if (mqttClient.connected && deviceData) {
        const state_topic = `${MQTT_CONSTANTS.TOPICS.BASE}/${values.name}/estado`;
        const temp_topic = `${MQTT_CONSTANTS.TOPICS.BASE}/${values.name}/temperatura`;
        const hum_topic = `${MQTT_CONSTANTS.TOPICS.BASE}/${values.name}/umidade`;
        const input_type = values.input.type;
        const output_type = values.output.type;

        const json = {
          command: MQTT_CONSTANTS.COMMANDS.SET_DEVICE_CONFIG,
          msg_id: 1,
          response_topic: MQTT_CONSTANTS.TOPICS.RESPONSES,
          data: {
            state_topic,
            temp_topic,
            hum_topic,
            input_type,
            output_type,
          },
        };
        const topic = `${MQTT_CONSTANTS.TOPICS.DEVICE}/${deviceData?.id}`;

        mqttClient.publish(topic, JSON.stringify(json));

        const { devicesList, unregisteredDevicesList } =
          store.getState().devices;

        store.dispatch(
          DeciveActions.setDevicesList({
            devicesList: [
              ...devicesList,
              {
                id: deviceData.id,
                name: values.name,
                type: deviceData.mode,
                temperature: 0,
                humidity: 0,
                input: { ...values.input, updatedAt: "" },
                output: { ...values.output, value: 0 },
                updatedAt: "",
              },
            ],
          })
        );

        const unregDevices = [...unregisteredDevicesList];
        const index = unregDevices.findIndex((d) => d.id === deviceData?.id);
        if (index >= 0) unregDevices.splice(index, 1);
        store.dispatch(
          DeciveActions.setUnregisteredDevicesList({
            devicesList: unregDevices,
          })
        );

        handleClose();
        history.push(PATHS.REGISTERED_DEVICES);
      }
    },
  });

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle color="primary">Cadastrar Device</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} className={classes.formGrid}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Local"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              variant="outlined"
              error={Boolean(formik.errors.name && formik.touched.name)}
              helperText={
                formik.errors.name && formik.touched.name && formik.errors.name
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="input.name"
              label="Entrada"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.input.name}
              variant="outlined"
              error={Boolean(
                formik.errors?.input?.name && formik.touched?.input?.name
              )}
              helperText={
                formik.errors?.input?.name &&
                formik.touched?.input?.name &&
                formik.errors?.input?.name
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="input.type"
              label="Tipo"
              select
              fullWidth
              variant="outlined"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.input.type}
              error={Boolean(
                formik.errors?.input?.type && formik.touched?.input?.type
              )}
              helperText={
                formik.errors?.input?.type &&
                formik.touched?.input?.type &&
                formik.errors?.input?.type
              }
            >
              {DEVICE_CONSTANTS.INPUT_TYPES.map((TYPE) => (
                <MenuItem key={`input-${TYPE.KEY}`} value={TYPE.KEY}>
                  {TYPE.VALUE}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="output.name"
              label="Saída"
              fullWidth
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.output.name}
              variant="outlined"
              error={Boolean(
                formik.errors?.output?.name && formik.touched?.output?.name
              )}
              helperText={
                formik.errors?.output?.name &&
                formik.touched?.output?.name &&
                formik.errors?.output?.name
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="output.type"
              label="Tipo"
              select
              fullWidth
              variant="outlined"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.output.type}
              error={Boolean(
                formik.errors?.output?.type && formik.touched?.output?.type
              )}
              helperText={
                formik.errors?.output?.type &&
                formik.touched?.output?.type &&
                formik.errors?.output?.type
              }
            >
              {DEVICE_CONSTANTS.OUTPUT_TYPES.map((TYPE) => (
                <MenuItem key={`output-${TYPE.KEY}`} value={TYPE.KEY}>
                  {TYPE.VALUE}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset">
              <FormGroup row>
                <FormControlLabel
                  value="input.isAlarm"
                  label="Definir Entrada como Alarme"
                  labelPlacement="end"
                  control={
                    <Checkbox
                      onChange={(_, checked) =>
                        formik.setFieldValue("input.isAlarm", checked)
                      }
                      checked={formik.values.input.isAlarm}
                    />
                  }
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={() => formik.handleSubmit()}>Cadastrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export { RegistrationForm };
export default RegistrationForm;
