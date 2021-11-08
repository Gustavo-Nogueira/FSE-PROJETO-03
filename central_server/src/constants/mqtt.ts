// eslint-disable-next-line import/no-anonymous-default-export
export default {
  MOSQUITTO_BROKER_URL: "ws://mqtt.eclipseprojects.io:80/mqtt",
  TOPICS: {
    BASE: "fse2021/170144259",
    DEVICE: "fse2021/170144259/dispositivos",
    CONFIG: "fse2021/170144259/dispositivos/#",
    TEMPERATURE: "fse2021/170144259/+/temperatura",
    HUMIDITY: "fse2021/170144259/+/umidade",
    STATE: "fse2021/170144259/+/estado",
    RESPONSES: "fse2021/170144259/responses",
  },
  COMMANDS: {
    DEVICE_INIT: 1,
    RESET_DEVICE: 2,
    SET_DEVICE_CONFIG: 3,
    SET_OUTPUT_VALUE: 4,
    REQUEST_IO_STATES: 5,
    INPUT_PUSH_NOTIFICATION: 6,
    OUTPUT_PUSH_NOTIFICATION: 7,
    CMD_TEMPERATURE_UPDATE: 8,
    CMD_HUMIDITY_UPDATE: 9,
  },
  RESPONSE_STATUSES: {
    OK: 0,
    NOK: -1,
  },
};
