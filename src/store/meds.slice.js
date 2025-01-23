import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMedicines } from "../services/meds.service";
// clean architecture
export const fetchMedicines = createAsyncThunk(
  "meds/fetchMedicines",
  async () => {
    const userId = await AsyncStorage.getItem("idOfUser");
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const response = await getMedicines(apiUrl, userId);
    const latestMeds = response;
    const cachedMeds = await AsyncStorage.getItem("medicines");
    if (JSON.stringify(cachedMeds) !== JSON.stringify(latestMeds)) {
      await AsyncStorage.setItem("medicines", JSON.stringify(latestMeds));
      return latestMeds;
    }
    return cachedMeds.length === 0 ? latestMeds : JSON.parse(cachedMeds);
  }
);

export const loadCachedMedicines = createAsyncThunk(
  "meds/loadCachedMedicines",
  async () => {
    const cachedMeds = await AsyncStorage.getItem("medicines");
    return cachedMeds ? JSON.parse(cachedMeds) : [];
  }
);

export const removeCachedMedicine = createAsyncThunk(
  "meds/removeCachedMedicine",
  async (medicineId) => {
    console.log(medicineId);
    try {
      const cachedMeds = await AsyncStorage.getItem("medicines");
      const medsArray = cachedMeds ? JSON.parse(cachedMeds) : [];
      const updatedMeds = medsArray.filter((med) => med._id !== medicineId);
      await AsyncStorage.setItem("medicines", JSON.stringify(updatedMeds));
      return updatedMeds;
    } catch (error) {
      console.error("Failed to remove the medicine from cache: ", error);
      throw error;
    }
  }
);

const medsSlice = createSlice({
  name: "meds",
  initialState: {
    medicines: [],
    status: "idle",
    userData: {
      userName: "",
      idOfUser: "",
      token: "",
    },
  },
  reducers: {
    setUserData(state, action) {
      state.userData = action.payload;
    },
    clearUserData(state) {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMedicines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMedicines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.medicines = action.payload;
      })
      .addCase(fetchMedicines.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(loadCachedMedicines.fulfilled, (state, action) => {
        state.medicines = action.payload;
      })
      .addCase(removeCachedMedicine.fulfilled, (state, action) => {
        state.medicines = action.payload;
        state.status = "succeeded";
      });
  },
});

export const { setUserData, clearUserData } = medsSlice.actions;

export default medsSlice.reducer;
