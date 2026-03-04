import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AmountInputProps {
  value: string;
  onChange: (val: string) => void;
  symbol?: string;
}

const AmountInput = ({ value, onChange, symbol }: AmountInputProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, "");
      const parts = raw.split(".");
      const formatted = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw;
      onChange(formatted);
    },
    [onChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        Amount
      </label>
      <div
        className={cn(
          "relative rounded-2xl border-2 transition-all duration-300 overflow-hidden",
          focused
            ? "input-glow border-primary/40 bg-primary/[0.03]"
            : "border-border/50 bg-muted/20"
        )}
      >
        {/* Gradient top line when focused */}
        {focused && (
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-brand opacity-60" />
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="0.00"
          className="w-full bg-transparent px-5 py-5 text-2xl font-heading font-bold text-foreground placeholder:text-muted-foreground/30 outline-none"
        />
        {symbol && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-heading font-semibold text-muted-foreground/60 bg-muted/50 px-3 py-1 rounded-lg">
            {symbol}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AmountInput;
