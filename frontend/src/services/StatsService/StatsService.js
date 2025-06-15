import { api } from "../api";
import axios from "axios";

const StatsService = {
  getStats: async (signal) => {
    try {
      const response = await api.get("/api/stats", { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel?.(error) || error.code === "ERR_CANCELED") {
        return null;
      }
      throw error;
    }
  }
};

export default StatsService;
