import { ITx } from "@/types/tx.types";
import { api } from "./client";

const BASE_API_ENDPOINT = "/web3";

export const Web3API = {
  verify: (data: { txHash: string; txId: string }) =>
    api<ITx>(`${BASE_API_ENDPOINT}/verify`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
