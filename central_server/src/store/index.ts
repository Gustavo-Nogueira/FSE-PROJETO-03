import { createStore, Store } from "redux";

// Redux Persist"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Types
import { DevicesState } from "./devices/types";
import { DrawerState } from "./drawer/types";

import createRootReducer from "./rootReducer";

export interface ApplicationState {
  devices: DevicesState;
  drawer: DrawerState;
}

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["devices"],
};

const persistedReducer = persistReducer(persistConfig, createRootReducer({}));

const store: Store<ApplicationState> = createStore(persistedReducer);

export const persistor = persistStore(store);

export default store;
