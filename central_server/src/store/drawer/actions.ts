import { action } from "typesafe-actions";

import { DrawerTypes } from "./types";

export const setOpenDrawer = (payload: { open: boolean }) =>
  action(DrawerTypes.SET_OPEN_DRAWER, payload);
