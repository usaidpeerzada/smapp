import { configureStore } from "@reduxjs/toolkit";
import medsReducer from "./meds.slice";

const store = configureStore({
  reducer: {
    meds: medsReducer,
  },
});

export default store;
