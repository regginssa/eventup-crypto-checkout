export type TTxStatus =
  | "pending"
  | "detected"
  | "confirming"
  | "confirmed"
  | "expired"
  | "failed";

export interface ITx {
  _id?: string;
  amount: string;
  currency: string;
  from: string;
  to: string;
  txHash: string;
  status: TTxStatus;
  webhookUrl: string;
}
