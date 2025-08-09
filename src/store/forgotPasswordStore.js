import { create } from "zustand";
import { persist } from "zustand/middleware";

const useForgotPasswordStore = create(
  persist(
    (set) => ({
      isForgotPassword: false,

      setIsForgotPassword: (isForgotPassword) =>
        set(() => ({
          isForgotPassword: isForgotPassword,
        })),

      clearIsForgotPassword: () =>
        set(() => ({
          isForgotPassword: null,
        })),
    }),
    {
      name: "forgotPasswordState",
      partialize: (state) => ({
        isForgotPassword: state.isForgotPassword,
      }),
    }
  )
);

export default useForgotPasswordStore;
