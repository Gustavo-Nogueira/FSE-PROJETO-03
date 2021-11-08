/*
 * Action Types
 */
export enum DevicesTypes {
  SET_DEVICES_LIST = "@devices/SET_DEVICES_LIST",
  SET_UNREGISTERED_DEVICES_LIST = "@devices/SET_UNREGISTERED_DEVICES_LIST",
}

/*
 * Data types
 */
export interface UnregisteredDeviceInterface {
  id: string;
  mode: number;
  updatedAt: string;
}

export interface DeviceInputInterface {
  name: string;
  type: number;
  isAlarm: boolean;
  updatedAt: string;
}

export interface DeviceOutputInterface {
  name: string;
  type: number;
  value: number;
}

export interface DeviceInterface {
  id: string;
  name: string;
  type: number;
  humidity: number;
  temperature: number;
  input: DeviceInputInterface;
  output: DeviceOutputInterface;
  updatedAt: string;
}

/*
 * State type
 */
export interface DevicesState {
  readonly devicesList: DeviceInterface[];
  readonly unregisteredDevicesList: UnregisteredDeviceInterface[];
}
