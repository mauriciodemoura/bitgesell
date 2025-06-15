import { api } from "../api";
import axios from "axios";

const ItemsService = {
  getItems: async ({ q = '', page = 1, limit = 10, signal } = {}) => {
    try {
      const params = { q, page, limit };
      const response = await api.get("/api/items", {
        params,
        signal,
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel?.(error)) {
        return;
      }
      console.error("Error:", error);
      throw error;
    }
  },
};

export default ItemsService;
