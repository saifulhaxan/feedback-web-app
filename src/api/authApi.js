import Fetcher from "../library/Fetcher";
import { supabase } from "../library/supabase";

export const register = async (data) => {
  return Fetcher.post("user/auth/register", data);
};

export const login = async (data) => {
  return Fetcher.post("user/auth/login", data);
};

export const sendOtp = async (data) => {
  return Fetcher.get("user/auth/send-otp");
};

export const verifyOtp = async (data) => {
  return Fetcher.post("user/auth/verify-email", data);
};

export const checkOtp = async (data) => {
  return Fetcher.post("user/auth/checkOtp", data);
};

export const completeProfile = async (data) => {
  // Handle both FormData and regular JSON data
  if (data instanceof FormData) {
    return Fetcher.post("user/auth/create-profile", data);
  } else {
    // For JSON data with the exact structure: { title, expertise, roleId, username }
  return Fetcher.post("user/auth/create-profile", data);
  }
};

export const socialLogin = async (data) => {
  // Ensure the payload structure matches the required format
  const payload = {
    provider: data.provider, // "GOOGLE" or "APPLE"
    providerId: data.providerId, // Provider-specific ID
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname
  };
  
  return Fetcher.post("user/auth/social-login", payload);
};

export const forgotPassword = async (data) => {
  return Fetcher.post("user/auth/send-password-reset-otp", data);
};

export const resetPassword = async (data) => {
  return Fetcher.post("user/auth/reset-password", data);
};

export default {
  register,
  login,
  sendOtp,
  verifyOtp,
  completeProfile,
  socialLogin,
  checkOtp,
  resetPassword,
};
