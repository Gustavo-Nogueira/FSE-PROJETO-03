// eslint-disable-next-line import/no-anonymous-default-export
export default {
  INPUT_TYPES: [{ KEY: 1, VALUE: "ENTRADA BINÁRIA" }],
  OUTPUT_TYPES: [
    { KEY: 1, VALUE: "SAÍDA BINÁRIA" },
    { KEY: 2, VALUE: "SAÍDA DIMERIZÁVEL" },
  ],
  DEVICE_MODES: [
    { KEY: 1, VALE: "MODO LOW POWER" },
    { KEY: 2, VALE: "MODO NORMAL" },
  ],
};

export const DEVICE_CONSTANTS_OBJ = {
  OUTPUT_TYPES: {
    BINARY: { KEY: 1, VALUE: "SAÍDA BINÁRIA" },
    DIMMABLE: { KEY: 2, VALUE: "SAÍDA DIMERIZÁVEL" },
  },
  DEVICE_MODES: {
    LOW_POWER_MODE: { KEY: 1, VALE: "MODO LOW POWER" },
    NORMAL_MODE: { KEY: 2, VALE: "MODO NORMAL" },
  },
};
