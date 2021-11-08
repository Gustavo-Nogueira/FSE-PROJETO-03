/*
 * Action Types
 */
export enum DrawerTypes {
  SET_OPEN_DRAWER = "@drawer/SET_OPEN_DRAWER",
}

/*
 * State type
 */
export interface DrawerState {
  readonly open: boolean;
}
