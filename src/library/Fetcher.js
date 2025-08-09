import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { app_url } from "../config/constants";

class Fetcher {
  constructor() {
    this.axiosSetup = null;
    // this.bearer;
    this.setup();
  }

  setup = async () => {
    this.axiosSetup = axios.create({
      baseURL: app_url,
      timeout: 20000,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    });

    this.axiosSetup.interceptors.request.use(
      function (config) {
        console.log("🚀 Making request to:", config.url);
        console.log("📤 Request data:", config.data);
        console.log("🔑 Auth header:", config.headers.Authorization ? "Present" : "Missing");
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    this.axiosSetup.interceptors.response.use(
      function (response) {
        console.log("✅ Response received:", response.status, response.config.url);
        return response;
      },
      function (error) {
        if (error.response?.status === 401) {
          localStorage.clear();
          toast.error("Session expired. Please login again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
        console.error("❌ Response error:", error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );

    let token = null;
    token = localStorage.getItem("access_token");

    if (token) {
      this.axiosSetup.defaults.headers.common.Authorization = `Bearer ${token}`;
      console.log("🔑 Token loaded:", token.substring(0, 20) + "...");
    } else {
      console.warn("⚠️ No access token found in localStorage");
    }
  };

  get = async (route, params, extra) => {
    return this.axiosSetup.get(route, params);
  };

  post = async (route, params, extra) => {
    return this.axiosSetup.post(route, params, extra);
  };

  patch = async (route, params, extra) => {
    return this.axiosSetup.patch(route, params);
  };

  put = async (route, params, extra) => {
    return this.axiosSetup.put(route, params);
  };

  delete = async (route, params, extra) => {
    return this.axiosSetup.delete(route, params);
  };

  removeToken = () => {
    delete this.axiosSetup.defaults.headers.common.Authorization;
  };
}

export default new Fetcher();
