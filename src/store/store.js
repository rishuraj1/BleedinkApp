import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dataStore = (set) => ({
  user: [],
  addUserData: (userData) => {
    set((state) => {
      user: [...state.user, userData];
    });
  },
  removeUserData: () => {
    set((state) => {
      user: null;
    });
  },
});

export const useDataStore = create(
  devtools(
    persist(dataStore, {
      name: "userdata",
      getStorage: () => AsyncStorage,
    })
  )
);
