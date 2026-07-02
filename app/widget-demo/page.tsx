"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, X, MessageSquare, ChevronDown, MapPin, Bed, Bath } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
  properties?: Property[];
}

interface Property {
  address: string;
  price: string;
  beds: number;
  baths: number;
  suburb: string;
  img: string;
}

const PROPERTIES: Property[] = [
  { address: "32 Ocean Parade", suburb: "Brighton", price: "$3,200,000", beds: 4, baths: 3, img: "#DBEAFE" },
  { address: "7 Hillcrest Ave", suburb: "Toorak", price: "$5,800,000", beds: 5, baths: 4, img: "#DCF8E8" },
  { address: "55 Bay Rd", suburb: "St Kilda", price: "$2,100,000", beds: 3, baths: 2, img: "#EDE9FE" },
  { address: "14A Collins St", suburb: "Melbourne CBD", price: "$1,850,000", beds: 2, baths: 2, img: "#FEF3C7" },
];

function getReply(input: string): { text: string; properties?: Property[] } {
  const q = input.toLowerCase();
  if (q.includes("beach") || q.includes("ocean") || q.includes("coastal") || q.includes("bayside")) {
    return { text: "I found some beautiful coastal and bayside properties for you:", properties: PROPERTIES.filter(p => ["Brighton", "St Kilda"].includes(p.suburb)) };
  }
  if (q.includes("budget") || q.includes("under") || q.includes("cheap") || q.includes("afford")) {
    return { text: "Here are properties within the $2M range:", properties: PROPERTIES.filter(p => !p.price.includes("5,") && !p.price.includes("3,2")) };
  }
  if (q.includes("toorak") || q.includes("south yarra") || q.includes("luxury") || q.includes("premium")) {
    return { text: "Our premium listings in Melbourne's finest suburbs:", properties: PROPERTIES.filter(p => p.suburb === "Toorak") };
  }
  if (q.includes("bed") || q.includes("room") || q.includes("family")) {
    return { text: "Here are some great family-sized properties:", properties: PROPERTIES.filter(p => p.beds >= 3) };
  }
  if (q.includes("document") || q.includes("section 32") || q.includes("contract")) {
    return { text: "I can send you the Section 32 or Contract of Sale for any property. Which listing are you interested in?" };
  }
  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return { text: "Hi there! I'm Samantha, your AI property guide. I can help you find properties, answer questions, or send documents. What are you looking for?" };
  }
  return { text: "Great question! I can help you find properties, check availability, or send you documents like Section 32s and contracts. What suburb or budget are you working with?" };
}

export default function WidgetDemoPage() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm Samantha, your AI property guide. What can I help you find today?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const bottomRef = useRef<HTMLDivElement>(null);
  const brandColor = "#2342B0";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const reply = getReply(userMsg);
    setMessages(prev => [...prev, { role: "assistant", ...reply }]);
    setTyping(false);

    // Trigger lead form after 3 user messages
    if (messages.filter(m => m.role === "user").length === 2 && !leadCaptured) {
      setTimeout(() => setShowLeadForm(true), 500);
    }
  }

  function submitLead() {
    setLeadCaptured(true);
    setShowLeadForm(false);
    setMessages(prev => [...prev, { role: "assistant", text: `Thanks ${leadForm.name}! I've saved your details. One of our agents will follow up shortly. In the meantime, keep exploring listings!` }]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="text-center mb-8 absolute top-8 left-1/2 -translate-x-1/2">
        <p className="text-white/60 text-sm">RealtyAvatar Widget Demo — embed this on any real estate website</p>
      </div>

      {/* Fake website background */}
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl opacity-40 pointer-events-none absolute" style={{ height: "70vh" }}>
        <div className="h-14 bg-gray-100 flex items-center px-6 gap-3 border-b">
          <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
          <div className="flex-1 bg-white rounded-full h-7 mx-4" />
        </div>
        <div className="p-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      </div>

      {/* Widget bubble */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 z-50"
          style={{ background: brandColor }}
        >
          <MessageSquare size={22} />
        </button>
      )}

      {/* Widget panel */}
      {open && (
        <div className="fixed bottom-8 right-8 w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-[#E5E7EB]" style={{ height: "560px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 text-white shrink-0" style={{ background: brandColor }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">S</div>
              <div>
                <p className="text-[13px] font-semibold">Samantha</p>
                <p className="text-[10px] opacity-75">AI Property Guide · Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "text-white rounded-br-sm"
                    : "bg-[#F3F4F6] text-[#1F2530] rounded-bl-sm"
                }`} style={msg.role === "user" ? { background: brandColor } : {}}>
                  {msg.text}
                </div>

                {msg.properties && (
                  <div className="mt-2 space-y-2 w-full max-w-[90%]">
                    {msg.properties.map(p => (
                      <div key={p.address} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex items-center gap-3 p-3 hover:border-[#2342B0]/30 transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-lg shrink-0" style={{ background: p.img }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#1F2530] truncate">{p.address}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={9} className="text-[#9CA3AF]" />
                            <p className="text-[10px] text-[#9CA3AF]">{p.suburb}</p>
                          </div>
                          <p className="text-[12px] font-bold mt-0.5" style={{ color: brandColor }}>{p.price}</p>
                          <div className="flex gap-2 mt-0.5 text-[10px] text-[#9CA3AF]">
                            <span className="flex items-center gap-0.5"><Bed size={9} />{p.beds}</span>
                            <span className="flex items-center gap-0.5"><Bath size={9} />{p.baths}</span>
                          </div>
                        </div>
                        <button className="text-[10px] font-semibold rounded-full px-2.5 py-1 border shrink-0" style={{ color: brandColor, borderColor: brandColor }}>View</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-start">
                <div className="bg-[#F3F4F6] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {/* Lead capture form */}
            {showLeadForm && !leadCaptured && (
              <div className="bg-[#EFF6FF] border border-[#93C5FD] rounded-xl p-4 space-y-2.5">
                <p className="text-[12px] font-semibold text-[#2342B0]">Save your search — we'll match new listings</p>
                <input value={leadForm.name} onChange={e => setLeadForm(p => ({...p, name: e.target.value}))} placeholder="Your name" className="w-full px-3 py-2 text-[12px] border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#2342B0]" />
                <input value={leadForm.email} onChange={e => setLeadForm(p => ({...p, email: e.target.value}))} placeholder="Email address" className="w-full px-3 py-2 text-[12px] border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#2342B0]" />
                <input value={leadForm.phone} onChange={e => setLeadForm(p => ({...p, phone: e.target.value}))} placeholder="Phone (optional)" className="w-full px-3 py-2 text-[12px] border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#2342B0]" />
                <div className="flex gap-2">
                  <button onClick={() => setShowLeadForm(false)} className="flex-1 py-2 text-[12px] border border-[#D1D5DB] rounded-full hover:bg-gray-50 transition-colors">Skip</button>
                  <button onClick={submitLead} disabled={!leadForm.name || !leadForm.email} className="flex-1 py-2 text-[12px] text-white rounded-full disabled:opacity-40 transition-colors" style={{ background: brandColor }}>Save</button>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-[#E5E7EB] shrink-0 flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Ask me anything…"
              className="flex-1 px-3 py-2 text-[13px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-full focus:outline-none focus:border-[#2342B0]"
            />
            <button onClick={send} disabled={!input.trim()} className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-colors" style={{ background: brandColor }}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
