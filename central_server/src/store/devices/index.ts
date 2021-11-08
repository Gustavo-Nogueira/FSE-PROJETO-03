import { Reducer } from "redux";

import { DevicesState, DevicesTypes } from "./types";

const INITIAL_STATE: DevicesState = {
  devicesList: [],
  unregisteredDevicesList: [],
};

const reducer: Reducer<DevicesState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DevicesTypes.SET_DEVICES_LIST:
      return {
        ...state,
        devicesList: action.payload.devicesList,
      };
    case DevicesTypes.SET_UNREGISTERED_DEVICES_LIST:
      return {
        ...state,
        unregisteredDevicesList: action.payload.devicesList,
      };
    default:
      return state;
  }
};

export default reducer;
