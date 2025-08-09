// src/stores/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      childId: null,
      email: null,

      // ✅ Required function!
      setUser: ({ childId, email }) =>
        set(() => ({
          childId,
          email,
        })),

      clearUser: () =>
        set(() => ({
          childId: null,
          email: null,
        })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        childId: state.childId,
        email: state.email,
      }),
    }
  )
);

export default useUserStore;
