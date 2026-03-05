import { ITx } from "@/types/tx.types";
import { api } from "./client";

const BASE_API_ENDPOINT = "/tx";

export const TxAPI = {
  getOne: (id: string) => api<ITx>(`${BASE_API_ENDPOINT}/${id}`),

  create: (data: any) =>
    api<ITx>(BASE_API_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    api<ITx>(`${BASE_API_ENDPOINT}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    api(`${BASE_API_ENDPOINT}/${id}`, {
      method: "DELETE",
    }),
};
