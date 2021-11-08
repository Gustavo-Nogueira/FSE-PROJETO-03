import { combineReducers } from "redux";

import devices from "./devices";
import drawer from "./drawer";

const createRootReducer = (history: any) =>
  combineReducers({
    devices,
    drawer,
  });

export default createRootReducer;
