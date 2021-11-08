import { action } from "typesafe-actions";

import {
  DeviceInterface,
  UnregisteredDeviceInterface,
  DevicesTypes,
} from "./types";

export const setDevicesList = (payload: { devicesList: DeviceInterface[] }) =>
  action(DevicesTypes.SET_DEVICES_LIST, payload);

export const setUnregisteredDevicesList = (payload: {
  devicesList: UnregisteredDeviceInterface[];
}) => action(DevicesTypes.SET_UNREGISTERED_DEVICES_LIST, payload);
