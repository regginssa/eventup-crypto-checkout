import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import CryptoSelector, { tokens } from "@/components/CryptoSelector";
import AmountInput from "@/components/AmountInput";
import TransactionStatus from "@/components/TransactionStatus";
import QRPayment from "@/components/QRPayment";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Loader2, Info, Wallet } from "lucide-react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useAppKitNetworkCore,
  useDisconnect,
} from "@reown/appkit/react";
import { ITx, TTxStatus } from "@/types/tx.types";
import { TxAPI } from "@/api/tx.api";
import { useToast } from "@/hooks/use-toast";
import { useEther } from "@/hooks/use-ether";
import { useSolana } from "@/hooks/use-solana";
import { AddressAPI } from "@/api/address.api";
import { Web3API } from "@/api/web3.api";
import CryptoJS from "crypto-js";

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
  const [depositAddresses, setDepositAddresses] = useState<{
    eth: string;
    sol: string;
  }>({ eth: "", sol: "" });
  const [amount, setAmount] = useState<string>("0.0001");
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [tx, setTx] = useState<ITx | null>(null);
  const [txStatus, setTxStatus] = useState<TTxStatus>("idle");
  const [showQR, setShowQR] = useState(false);
  const [initLoading, setInitLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const { pay: payEth } = useEther();
  const { pay: paySol } = useSolana();

  useEffect(() => {
    async function init() {
      const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
      if (!SECRET_KEY) return;

      const params = new URLSearchParams(window.location.search);
      const encrypted = params.get("data");

      let payload = null;

      if (encrypted) {
        try {
          const bytes = CryptoJS.AES.decrypt(encrypted);
          const decrypted = bytes.toString(CryptoJS.enc.Utf8);
          payload = JSON.parse(decrypted);
        } catch (err) {
          console.error("Invalid encrypted payload");
          return;
        }
      }

      if (!payload) {
        return;
      }

      const { amount, currency, webhook, metadata, redirect } = payload;

      if (!amount || !currency || !webhook) return;

      setInitLoading(true);

      const data: ITx = {
        amount,
        currency,
        webhookUrl: webhook,
        from: "",
        to: "",
        status: "pending",
        txHash: "",
        metadata: JSON.parse(metadata),
        redirectUrl: redirect,
      };

      // const txRes = await TxAPI.create(data);

      // if (!txRes.ok) {
      //   toast({ variant: "destructive", title: "Failed to initialize" });
      //   setInitLoading(false);
      //   return;
      // }

      // const newTx = txRes.data;
      // setTx(newTx);

      const addressRes = await AddressAPI.getAll();
      if (addressRes.data) setDepositAddresses(addressRes.data);
      setAmount(amount);
      setSelectedToken(currency.toLowerCase());
      setInitLoading(false);
    }

    init();
  }, []);

  useEffect(() => {
    if (!tx) return;
    const { amount, currency, status } = tx;
    setAmount(amount);
    setSelectedToken(currency.toLowerCase());
    setTxStatus(status);
  }, [tx]);

  const handlePay = async () => {
    if (!tx?._id) return;
    if (amount === "" || Number(amount) <= 0)
      return toast({ variant: "destructive", title: "Amount is incorrect" });

    if (selectedToken === "") {
      return toast({
        variant: "destructive",
        title: "Selected token is incorrect",
      });
    }

    setTxStatus("confirming");
    const isEth = selectedToken.includes("eth");

    let txHash = null;

    if (isEth) {
      txHash = await payEth(selectedToken as any, amount, depositAddresses.eth);
    } else {
      txHash = await paySol(selectedToken as any, amount, depositAddresses.sol);
    }

    if (!txHash) {
      setTxStatus("idle");
    }

    const res = await Web3API.verify({ txHash, txId: tx._id });

    if (!res.ok || !res.data) {
      toast({
        variant: "destructive",
        title: res.message || "Payment confirmation failed",
      });
    }

    setTx(res.data);
    window.location.href = res.data.redirectUrl;
  };

  const token = tokens.find((t) => t.id === selectedToken);

  if (initLoading) {
    return <InitSpinner />;
  }

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
          <img
            src={logo}
            alt="Charlie Unicorn AI"
            className="w-14 h-14 rounded-2xl shadow-xl"
          />
          <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/20" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold gradient-brand-text leading-tight">
            Charlie Unicorn AI
          </h1>
          <p className="text-xs text-muted-foreground">
            Secure Crypto Payments
          </p>
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
                  <h2 className="font-heading text-xl font-bold text-foreground">
                    Checkout
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Choose your token and amount
                  </p>
                </div>

                <CryptoSelector
                  selected={selectedToken}
                  onSelect={setSelectedToken}
                  disabled
                />

                <AmountInput
                  value={amount}
                  onChange={setAmount}
                  disabled
                  symbol={token?.symbol}
                />

                {/* Fee note */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground/70 px-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Network fees apply and are estimated at transaction time.
                  </span>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  {!isConnected ? (
                    <Button
                      variant="pay"
                      size="lg"
                      className="w-full h-14 rounded-2xl text-base"
                      onClick={() => open()}
                    >
                      <Wallet className="w-5 h-5" />
                      Connect
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="pay"
                        size="lg"
                        className="w-full h-14 rounded-2xl text-base"
                        disabled={txStatus === "confirmed"}
                        onClick={handlePay}
                      >
                        {txStatus === "confirming" ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <Wallet className="w-5 h-5" />
                            {txStatus === "confirmed" ? "Confirmed" : "Pay Now"}
                          </>
                        )}
                      </Button>

                      <Button
                        variant="secondary"
                        size="lg"
                        className="w-full h-14 rounded-2xl text-base"
                        onClick={() => disconnect()}
                      >
                        <Wallet className="w-5 h-5" />
                        Disconnect
                      </Button>
                    </>
                  )}

                  {/* {canPay && txStatus === "idle" && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setShowQR(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-muted/30"
                    >
                      <QrCode className="w-4 h-4" />
                      Pay via QR Code
                    </motion.button>
                  )} */}
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

const InitSpinner = () => (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background glow */}
    <div className="absolute -top-60 -left-60 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[160px]" />
    <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] rounded-full bg-accent/10 blur-[160px]" />

    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative z-10"
    >
      {/* Gradient border */}
      <div className="p-[1px] rounded-3xl bg-gradient-to-b from-primary/30 via-border/40 to-border/20">
        <div className="glass-card rounded-3xl px-10 py-9 flex flex-col items-center gap-6 text-center">
          {/* Animated spinner */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary"
            />

            {/* subtle glow */}
            <div className="absolute w-16 h-16 rounded-full bg-primary/10 blur-xl" />
          </div>

          {/* Text */}
          <div className="space-y-1">
            <p className="text-lg font-semibold gradient-brand-text">
              Initializing Payment
            </p>
            <p className="text-sm text-muted-foreground">
              Preparing secure transaction…
            </p>
          </div>

          {/* animated dots */}
          <motion.div className="flex gap-1" initial="hidden" animate="visible">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full bg-primary/70"
                variants={{
                  hidden: { opacity: 0.2, y: 0 },
                  visible: {
                    opacity: [0.2, 1, 0.2],
                    y: [0, -4, 0],
                  },
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default Index;
