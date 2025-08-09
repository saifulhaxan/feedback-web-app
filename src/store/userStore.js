import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      userData: null,

      setUserData: (user) =>
        set(() => ({
          userData: user,
        })),

      clearUserData: () =>
        set(() => ({
          userData: null,
        })),
    }),
    {
      name: "user-data-storage", // 👈 separate key for localStorage
      partialize: (state) => ({
        userData: state.userData,
      }),
    }
  )
);

export default useUserStore;
