import { Reducer } from "redux";
import { DrawerState, DrawerTypes } from "./types";

const INITIAL_STATE: DrawerState = {
  open: true,
};

const reducer: Reducer<DrawerState> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DrawerTypes.SET_OPEN_DRAWER:
      return {
        ...state,
        open: action.payload.open,
      };

    default:
      return state;
  }
};

export default reducer;
