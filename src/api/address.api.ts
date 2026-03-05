import { api } from "./client";

const BASE_API_ENDPOINT = "/address";

export const AddressAPI = {
  getAll: () => api<{ eth: string; sol: string }>(`${BASE_API_ENDPOINT}/all`),
};
