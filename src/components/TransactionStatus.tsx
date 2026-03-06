import { Loader2, CheckCircle2, XCircle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { TTxStatus } from "@/types/tx.types";

interface TransactionStatusProps {
  status: TTxStatus;
  errorMessage?: string;
}

const statusConfig: Record<
  TTxStatus,
  { icon: React.ReactNode; text: string; color: string; bg: string }
> = {
  idle: { icon: null, text: "", color: "", bg: "" },
  detected: { icon: null, text: "", color: "", bg: "" },
  expired: { icon: null, text: "", color: "", bg: "" },
  pending: { icon: null, text: "", color: "", bg: "" },
  confirming: {
    icon: <Loader2 className="w-5 h-5 animate-spin-slow" />,
    text: "Confirming on blockchain…",
    color: "text-accent",
    bg: "bg-accent/5 border-accent/20",
  },
  confirmed: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    text: "Transaction confirmed!",
    color: "text-success",
    bg: "bg-success/5 border-success/20",
  },
  failed: {
    icon: <XCircle className="w-5 h-5" />,
    text: "Transaction failed",
    color: "text-destructive",
    bg: "bg-destructive/5 border-destructive/20",
  },
};

const TransactionStatus = ({
  status,
  errorMessage,
}: TransactionStatusProps) => {
  if (
    status === "idle" ||
    status === "pending" ||
    status === "detected" ||
    status === "expired"
  )
    return null;

  const config = statusConfig[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex items-center gap-3 p-4 rounded-xl border",
          config.color,
          config.bg,
        )}
      >
        {config.icon}
        <div className="flex-1">
          <p className="font-medium text-sm">{config.text}</p>
          {status === "failed" && errorMessage && (
            <p className="text-xs text-muted-foreground mt-1">{errorMessage}</p>
          )}
        </div>
        {status === "confirming" && (
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionStatus;
