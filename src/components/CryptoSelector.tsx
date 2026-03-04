import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface CryptoToken {
  id: string;
  name: string;
  symbol: string;
  network?: string;
  icon: string;
  color: string;
}

const tokens: CryptoToken[] = [
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    icon: "/icons/eth.png",
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    icon: "/icons/sol.png",
    color: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "usdt-sol",
    name: "Tether",
    symbol: "USDT",
    network: "Solana",
    icon: "/icons/usdt.png",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: "usdt-eth",
    name: "Tether",
    symbol: "USDT",
    network: "Ethereum",
    icon: "/icons/usdt.png",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: "usdc-sol",
    name: "USD Coin",
    symbol: "USDC",
    network: "Solana",
    icon: "/icons/usdc.png",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "usdc-eth",
    name: "USD Coin",
    symbol: "USDC",
    network: "Ethereum",
    icon: "/icons/usdc.png",
    color: "from-blue-400 to-cyan-500",
  },
  {
    id: "chrle",
    name: "Charlie",
    symbol: "CHRLE",
    icon: "/icons/chrle.png",
    color: "from-pink-400 to-purple-500",
  },
  {
    id: "babyu",
    name: "BabyU",
    symbol: "BABYU",
    icon: "/icons/babyu.png",
    color: "from-amber-400 to-orange-500",
  },
];

interface CryptoSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const CryptoSelector = ({ selected, onSelect }: CryptoSelectorProps) => {
  const [expanded, setExpanded] = useState(true);
  const selectedToken = tokens.find((t) => t.id === selected);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest cursor-pointer">
          Select Cryptocurrency
        </label>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            expanded && "rotate-180",
          )}
        />
      </button>

      {/* Selected preview when collapsed */}
      {!expanded && selectedToken && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-3 rounded-xl glass-card border border-primary/30 glow-border"
        >
          <div
            className={cn(
              "text-lg w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br",
            )}
          >
            <img
              src={selectedToken.icon}
              alt={selectedToken.name}
              className="w-6 h-6 object-cover"
            />
          </div>
          <div>
            <p className="font-heading font-semibold text-sm text-foreground">
              {selectedToken.symbol}
            </p>
            {selectedToken.network && (
              <p className="text-[10px] text-muted-foreground">
                {selectedToken.network}
              </p>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {tokens.map((token, i) => {
                const isSelected = selected === token.id;
                return (
                  <motion.button
                    key={token.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      onSelect(token.id);
                      setExpanded(false);
                    }}
                    className={cn(
                      "relative group flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "border-primary/50 glow-border-active bg-primary/5"
                        : "border-border/50 hover:border-muted-foreground/30 hover:bg-muted/30",
                    )}
                  >
                    <div
                      className={cn(
                        "text-lg w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110",
                      )}
                    >
                      <img
                        src={token.icon}
                        alt={token.name}
                        className="w-6 h-6 object-cover"
                      />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-foreground">
                        {token.symbol}
                      </p>
                      {token.network && (
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {token.network}
                        </p>
                      )}
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full gradient-brand flex items-center justify-center shadow-md"
                      >
                        <Check className="w-3 h-3 text-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CryptoSelector;
export { tokens };
