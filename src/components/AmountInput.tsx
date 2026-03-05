import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AmountInputProps {
  value: string;
  onChange: (val: string) => void;
  symbol?: string;
  disabled?: boolean;
}

const AmountInput = ({
  value,
  onChange,
  symbol,
  disabled,
}: AmountInputProps) => {
  const [focused, setFocused] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const raw = e.target.value.replace(/[^0-9.]/g, "");
      const parts = raw.split(".");
      const formatted =
        parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw;

      onChange(formatted);
    },
    [onChange, disabled],
  );

  const isActive = focused && !disabled;

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
          disabled && "opacity-60 cursor-not-allowed bg-muted/30",
          !disabled && isActive
            ? "input-glow border-primary/40 bg-primary/[0.03]"
            : !disabled && "border-border/50 bg-muted/20",
        )}
      >
        {isActive && (
          <div className="absolute top-0 left-0 right-0 h-[2px] gradient-brand opacity-60" />
        )}

        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          onFocus={() => !disabled && setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder="0.00"
          className={cn(
            "w-full bg-transparent px-5 py-5 text-2xl font-heading font-bold outline-none",
            disabled
              ? "text-muted-foreground cursor-not-allowed"
              : "text-foreground placeholder:text-muted-foreground/30",
          )}
        />

        {symbol && (
          <span
            className={cn(
              "absolute right-5 top-1/2 -translate-y-1/2 text-sm font-heading font-semibold px-3 py-1 rounded-lg",
              disabled
                ? "text-muted-foreground/40 bg-muted/40"
                : "text-muted-foreground/60 bg-muted/50",
            )}
          >
            {symbol}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AmountInput;
