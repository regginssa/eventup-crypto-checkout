import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import CryptoSelector, { tokens } from "@/components/CryptoSelector";
import AmountInput from "@/components/AmountInput";
import TransactionStatus, { type TxStatus } from "@/components/TransactionStatus";
import QRPayment from "@/components/QRPayment";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Loader2, Info, QrCode, Wallet } from "lucide-react";

// Demo wallet addresses per token
const demoAddresses: Record<string, string> = {
  eth: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
  sol: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "usdt-sol": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "usdt-eth": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
  "usdc-sol": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  "usdc-eth": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD38",
  chrle: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  babyu: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
};

const Index = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [showQR, setShowQR] = useState(false);

  const token = tokens.find((t) => t.id === selectedToken);
  const canPay = selectedToken && amount && parseFloat(amount) > 0 && txStatus === "idle";

  const simulatePayment = useCallback(async () => {
    setTxStatus("wallet");
    await new Promise((r) => setTimeout(r, 2000));
    setTxStatus("confirming");
    await new Promise((r) => setTimeout(r, 3000));
    if (Math.random() > 0.3) {
      setTxStatus("success");
    } else {
      setTxStatus("error");
    }
  }, []);

  const resetTx = () => setTxStatus("idle");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedBackground />

      {/* Large ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 -left-60 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[160px]" />
        <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[160px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center gap-3 mb-10"
      >
        <div className="relative">
          <img src={logo} alt="Charlie Unicorn AI" className="w-14 h-14 rounded-2xl shadow-xl" />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold gradient-brand-text leading-tight">
            Charlie Unicorn AI
          </h1>
          <p className="text-xs text-muted-foreground">Secure Crypto Payments</p>
        </div>
      </motion.header>

      {/* Checkout Card */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card gradient border wrapper */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-b from-primary/20 via-border/30 to-border/10">
          <div className="glass-card rounded-3xl p-7 space-y-6 relative overflow-hidden">
            {/* Subtle top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 gradient-brand opacity-40 rounded-t-3xl" />

            {showQR && selectedToken ? (
              <QRPayment
                address={demoAddresses[selectedToken] || ""}
                amount={amount}
                symbol={token?.symbol || ""}
                onClose={() => setShowQR(false)}
              />
            ) : (
              <>
                <div className="text-center pt-2">
                  <h2 className="font-heading text-xl font-bold text-foreground">Checkout</h2>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Choose your token and amount
                  </p>
                </div>

                <CryptoSelector
                  selected={selectedToken}
                  onSelect={(id) => { setSelectedToken(id); resetTx(); }}
                />

                <AmountInput
                  value={amount}
                  onChange={(v) => { setAmount(v); resetTx(); }}
                  symbol={token?.symbol}
                />

                {/* Fee note */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70 px-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Network fees apply and are estimated at transaction time.</span>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button
                    variant="pay"
                    size="lg"
                    className="w-full h-14 rounded-2xl text-base"
                    disabled={!canPay || (txStatus !== "idle" && txStatus !== "success" && txStatus !== "error")}
                    onClick={txStatus === "success" || txStatus === "error" ? resetTx : simulatePayment}
                  >
                    {txStatus === "wallet" || txStatus === "confirming" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {txStatus === "wallet" ? "Awaiting Wallet…" : "Confirming…"}
                      </>
                    ) : txStatus === "success" || txStatus === "error" ? (
                      <>
                        <Wallet className="w-5 h-5" />
                        Pay Again
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Pay Now
                      </>
                    )}
                  </Button>

                  {canPay && txStatus === "idle" && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setShowQR(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/30"
                    >
                      <QrCode className="w-4 h-4" />
                      Pay via QR Code
                    </motion.button>
                  )}
                </div>

                <TransactionStatus
                  status={txStatus}
                  errorMessage="Insufficient balance or user rejected the transaction."
                />
              </>
            )}
          </div>
        </div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-10 text-xs text-muted-foreground/50"
      >
        © {new Date().getFullYear()} Charlie Unicorn AI — All rights reserved
      </motion.footer>
    </div>
  );
};

export default Index;
