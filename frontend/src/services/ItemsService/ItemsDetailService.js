import { api } from "../api";
import axios from "axios";

const ItemDetailService = {
  getItemById: async (id, signal) => {
    try {
      const response = await api.get(`/api/items/${id}`, { signal });
      return response.data;
    } catch (error) {
      if (axios.isCancel?.(error) || error.code === "ERR_CANCELED") {
        return null;
      }
      throw error;
    }
  },
};

export default ItemDetailService;
