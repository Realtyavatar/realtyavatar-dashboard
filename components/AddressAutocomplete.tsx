"use client";
import { useState, useEffect, useRef } from "react";

interface Suggestion {
  display: string;
  address: string;
  suburb: string;
}

interface Props {
  value: string;
  onChange: (address: string, suburb: string) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({ value, onChange, placeholder, className }: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<any>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function search(q: string) {
    if (q.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    try {
      // Use Nominatim (OpenStreetMap) with Australia filter
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&countrycodes=au&format=json&addressdetails=1&limit=6`,
        { headers: { "Accept-Language": "en-AU" } }
      );
      const data = await res.json();
      const mapped: Suggestion[] = data
        .filter((r: any) => r.address?.road || r.address?.house_number)
        .map((r: any) => {
          const addr = r.address;
          const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
          const suburb = addr.suburb || addr.city || addr.town || addr.village || "";
          const state = addr.state_code || addr.state || "";
          const postcode = addr.postcode || "";
          const suburbFull = [suburb, state, postcode].filter(Boolean).join(" ");
          return {
            display: r.display_name.split(",").slice(0, 3).join(","),
            address: street || r.display_name.split(",")[0],
            suburb: suburbFull,
          };
        });
      setSuggestions(mapped);
      setOpen(mapped.length > 0);
    } catch {}
    setLoading(false);
  }

  function handleInput(val: string) {
    setQuery(val);
    onChange(val, "");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(val), 350);
  }

  function select(s: Suggestion) {
    setQuery(s.address);
    onChange(s.address, s.suburb);
    setSuggestions([]);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        value={query}
        onChange={e => handleInput(e.target.value)}
        placeholder={placeholder || "Start typing an address..."}
        className={className}
        autoComplete="off"
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {loading && (
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ width: 14, height: 14, border: "2px solid #E2E8F0", borderTopColor: "#2342B0", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      )}
      {open && suggestions.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "white", border: "1px solid #E5E7EB", borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 999, overflow: "hidden"
        }}>
          {suggestions.map((s, i) => (
            <button key={i} type="button" onClick={() => select(s)}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", fontSize: 13, borderBottom: i < suggestions.length - 1 ? "1px solid #F3F4F6" : "none", background: "white", cursor: "pointer" }}
              onMouseOver={e => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseOut={e => (e.currentTarget.style.background = "white")}
            >
              <p style={{ fontWeight: 600, color: "#1F2530" }}>{s.address}</p>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{s.suburb}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
