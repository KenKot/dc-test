import { BASE_URL } from "@/utils/constants";
import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true, // like a loading state

  signup: async (firstname, email, password) => {
    set({ isLoading: true, error: null });

    console.log(firstname, email, password);

    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/signup",
        {
          firstname,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response?.data);
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
      });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message });
      console.log(error.response?.data?.message);

      throw error; // Prevents navigate("/verify-email") if needed
    }
  },

  verifyEmail: async (verificationToken) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/verify-email",
        {
          verificationToken,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response?.data);
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
      });
    } catch (error) {
      console.log(error.response?.data?.message);
      set({ isLoading: false, error: error.response?.data?.message });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      console.log("!!!!", response.data.user);

      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.data.user,
        // user: response.data.user,
        // //my/bw's backend doesnt send back "user"
        // I'll add it!
      });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message });
      console.log(error);
      throw error;
    }
  },

  logout: async () => {
    console.log("A.S. logout()");
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
    console.log("authStore.js checkAuth fired");

    // Accessing state values properly
    const currentState = get();
    // console.log("user: ", currentState.user || "no user");
    // console.log("isAuthenticated: ", currentState.isAuthenticated);
    // console.log("isCheckingAuth: ", currentState.isCheckingAuth);

    set({ isCheckingAuth: true, error: null });

    // BACKEND
    // res.status(200).json({
    //   _id: user._id, // remove?
    //   firstname: user.firstname,
    //   lastname: user.lastname,
    //   email: user.email,
    //   isVerified: user.isVerified,
    // });

    try {
      const response = await axios.get(BASE_URL + "/api/auth/check-auth", {
        withCredentials: true,
      });

      console.log("checkAuth from authStore.js user: ", response.data.user);

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
      console.log(error);
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        BASE_URL + "/api/auth/forgot-password",
        {
          email,
        },
        { withCredentials: true }
      );

      console.log(response.data.message);
      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
      console.log(error);
    }
  },
  resetPassword: async (token, password) => {
    console.log("A.S. resetPassword() fired");
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/reset-password/${token}`,
        {
          password,
        },
        { withCredentials: true }
      );

      console.log("@@@1", response.data.message);

      set({ isLoading: false, message: response.data.message });
    } catch (error) {
      console.log("@@@2", error.response.data.message);

      set({ isLoading: false, error: error.response?.data?.message });
      console.log(error);
      throw error;
    }
  },
}));
