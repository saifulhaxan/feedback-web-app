import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTokenStore = create(
  persist(
    (set) => ({
      tokens: null,

      setTokens: (tokens) =>
        set(() => ({
          tokens: tokens,
        })),

      clearTokens: () =>
        set(() => ({
          tokens: null,
        })),
    }),
    {
      name: "token-storage", // 👈 another separate key for tokens
      partialize: (state) => ({
        tokens: state.tokens,
      }),
    }
  )
);

export default useTokenStore;
