"use client";

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

function formatPrice(raw: string): string {
  // Strip everything except digits
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "";
  // Format with commas
  const num = parseInt(digits, 10);
  return "$" + num.toLocaleString("en-AU");
}

export function PriceInput({ value, onChange, placeholder, className }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow clearing
    if (!raw || raw === "$") { onChange(""); return; }
    onChange(formatPrice(raw));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Allow backspace to work naturally
    if (e.key === "Backspace" && value.length <= 2) {
      onChange("");
    }
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || "$0"}
      className={className}
    />
  );
}
