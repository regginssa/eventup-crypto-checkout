import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QRPaymentProps {
  address: string;
  amount: string;
  symbol: string;
  onClose: () => void;
}

const QRPayment = ({ address, amount, symbol, onClose }: QRPaymentProps) => {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayAddress = `${address.slice(0, 8)}...${address.slice(-6)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">Scan to pay</p>
          <p className="font-heading font-bold text-lg text-foreground">
            {amount} {symbol}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-foreground/95">
            <QRCodeSVG
              value={`${symbol.toLowerCase()}:${address}?amount=${amount}`}
              size={180}
              bgColor="hsl(0, 0%, 95%)"
              fgColor="hsl(230, 25%, 7%)"
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl glass-card">
          <code className="flex-1 text-xs text-muted-foreground font-mono truncate">
            {displayAddress}
          </code>
          <button
            onClick={copyAddress}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          ← Back to checkout
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default QRPayment;
