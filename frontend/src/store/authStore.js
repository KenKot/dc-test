import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true, // like a loading state

  signup: async (firstname, lastname, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/signup",
        {
          firstname,
          lastname,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      set({
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message });
      console.log(error.response?.data?.message);

      throw error; //  Prevents navigate("/verify-email") if needed
    }
  },

  verifyEmail: async (verificationToken) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/verify-email",
        { verificationToken },
        { withCredentials: true }
      );

      if (!response.data.user) {
        throw new Error("Unexpected response from server");
      }

      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Verification failed.";
      set({ isLoading: false, error: errorMessage });

      throw new Error(errorMessage);
    }
  },

  login: async (email, password, isRememberMe) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/login",
        {
          email,
          password,
          isRememberMe,
        },
        { withCredentials: true }
      );

      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
      });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message });
      console.log(error);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      set({ isLoading: false, isAuthenticated: false, user: null });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(BASE_URL + "/api/auth/check-auth", {
        withCredentials: true,
      });

      if (response.data.user) {
        set({
          isAuthenticated: true,
          user: response.data.user,
          isCheckingAuth: false,
        });
      } else {
        set({
          isAuthenticated: false,
          user: null,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      // console.log(error);
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send reset email.";
      set({ isLoading: false, error: errorMessage });

      throw new Error(errorMessage);
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password.";
      set({ isLoading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
