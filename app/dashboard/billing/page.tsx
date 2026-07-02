"use client";

import { useState } from "react";
import { Check, Zap, Building2, Crown, Rocket, Bot, ChevronRight, CreditCard } from "lucide-react";
import clsx from "clsx";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 199,
    listings: "Up to 5 listings",
    listingsAnnual: "Up to 60 listings",
    icon: Building2,
    color: "#6B7280",
    features: [
      "CRM dashboard",
      "Listings management",
      "Lead capture",
      "Documents & campaigns",
      "Team management",
      "Chat widget (basic)",
    ],
    current: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    listings: "Up to 15 listings",
    listingsAnnual: "Up to 180 listings",
    icon: Zap,
    color: "#2342B0",
    features: [
      "Everything in Starter",
      "Up to {listings} active listings",
      "Advanced lead scoring",
      "Priority support",
      "Campaign analytics",
      "Custom branding",
    ],
    current: true,
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 899,
    listings: "Up to 30 listings",
    listingsAnnual: "Up to 360 listings",
    icon: Rocket,
    color: "#7C3AED",
    features: [
      "Everything in Pro",
      "Up to {listings} active listings",
      "Multi-agent team access",
      "Bulk import/export",
      "API access",
      "Dedicated onboarding",
    ],
    current: false,
  },
  {
    id: "unlimited",
    name: "Unlimited",
    price: 1499,
    listings: "No listing cap",
    listingsAnnual: "No listing cap",
    icon: Crown,
    color: "#D97706",
    features: [
      "Everything in Agency",
      "Unlimited listings",
      "White-label option",
      "Custom integrations",
      "SLA guarantee",
      "Account manager",
    ],
    current: false,
  },
];

const AGENT_ADDON = {
  price: 399,
  conversations: 500,
  features: [
    "Lives in your team WhatsApp chat",
    "Remembers every client, property & conversation",
    "Upload contracts, photos & docs — stored forever",
    "Qualifies leads & books inspections",
    "Linked to your calendar",
    "Powered by Claude AI",
  ],
};

export default function BillingPage() {
  const [agentEnabled, setAgentEnabled] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const currentPlan = PLANS.find((p) => p.current)!;
  const annualDiscount = 0.15;

  function price(base: number) {
    return billingPeriod === "annual" ? Math.round(base * (1 - annualDiscount)) : base;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#1F2530]">Billing & Plans</h1>
          <p className="text-[13px] text-[#6B7280] mt-0.5">Manage your subscription and AI agent add-on</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D1D5DB] bg-white text-[13px] font-medium text-[#404754] hover:bg-gray-50 transition-colors">
          <CreditCard size={15} />
          Manage Payment
        </button>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wide mb-1">Current Plan</p>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${currentPlan.color}18` }}>
                <currentPlan.icon size={16} style={{ color: currentPlan.color }} />
              </div>
              <span className="text-[20px] font-bold text-[#1F2530]">{currentPlan.name}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#2342B0] text-[11px] font-semibold">Active</span>
            </div>
            <p className="text-[13px] text-[#6B7280] mt-1.5">
            {billingPeriod === "annual" ? currentPlan.listingsAnnual : currentPlan.listings} · Renews 21 July 2026
          </p>
          </div>
          <div className="text-right">
            <p className="text-[28px] font-bold text-[#1F2530]">${currentPlan.price}<span className="text-[14px] font-normal text-[#6B7280]">/mo</span></p>
            {agentEnabled && (
              <p className="text-[13px] text-[#2342B0] font-medium mt-0.5">+ $399/mo AI Agent</p>
            )}
          </div>
        </div>

        {/* Usage bar */}
        <div className="mt-5 pt-5 border-t border-[#F3F4F6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-medium text-[#6B7280]">Active Listings</span>
            <span className="text-[12px] font-semibold text-[#1F2530]">14 / 20</span>
          </div>
          <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div className="h-full bg-[#2342B0] rounded-full" style={{ width: "70%" }} />
          </div>
          {agentEnabled && (
            <>
              <div className="flex items-center justify-between mb-2 mt-4">
                <span className="text-[12px] font-medium text-[#6B7280]">AI Conversations this month</span>
                <span className="text-[12px] font-semibold text-[#1F2530]">187 / 500</span>
              </div>
              <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: "37%" }} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={clsx(
            "px-4 py-2 rounded-xl text-[13px] font-medium transition-colors",
            billingPeriod === "monthly" ? "bg-[#2342B0] text-white" : "bg-white border border-[#D1D5DB] text-[#6B7280]"
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod("annual")}
          className={clsx(
            "px-4 py-2 rounded-xl text-[13px] font-medium transition-colors flex items-center gap-2",
            billingPeriod === "annual" ? "bg-[#2342B0] text-white" : "bg-white border border-[#D1D5DB] text-[#6B7280]"
          )}
        >
          Annual
          <span className={clsx("text-[10px] font-bold px-1.5 py-0.5 rounded-full", billingPeriod === "annual" ? "bg-white/20 text-white" : "bg-[#D1FAE5] text-[#065F46]")}>
            SAVE 15%
          </span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = plan.current;
          return (
            <div
              key={plan.id}
              className={clsx(
                "relative bg-white rounded-[20px] border shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 flex flex-col",
                isCurrent
                  ? "border-[#2342B0] shadow-[0_0_0_3px_rgba(35,66,176,0.08)]"
                  : "border-[#D9DEE9]"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-[#2342B0] text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}18` }}>
                  <Icon size={18} style={{ color: plan.color }} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1F2530]">{plan.name}</p>
                  <p className="text-[11px] text-[#6B7280]">
                    {billingPeriod === "annual" ? plan.listingsAnnual : plan.listings}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <span className="text-[28px] font-bold text-[#1F2530]">${price(plan.price)}</span>
                <span className="text-[13px] text-[#6B7280]">/mo</span>
                {billingPeriod === "annual" ? (
                  <div className="mt-1.5 space-y-0.5">
                    <p className="text-[11px] text-[#6B7280] line-through">${plan.price}/mo</p>
                    <p className="text-[11px] text-[#6B7280]">${price(plan.price) * 12}/yr billed annually</p>
                    <p className="text-[11px] font-semibold text-[#12B76A]">Save ${(plan.price - price(plan.price)) * 12}/yr</p>
                  </div>
                ) : null}
              </div>

              <ul className="space-y-2.5 flex-1 mb-5">
                {plan.features.map((f) => {
                  const listingCount = billingPeriod === "annual"
                    ? (plan.listingsAnnual ?? plan.listings).replace("Up to ", "").replace(" listings", "")
                    : (plan.listings ?? "").replace("Up to ", "").replace(" listings", "");
                  const label = f.replace("{listings}", listingCount);
                  return (
                    <li key={f} className="flex items-start gap-2">
                      <Check size={13} className="mt-0.5 shrink-0 text-[#12B76A]" strokeWidth={2.5} />
                      <span className="text-[12px] text-[#404754]">{label}</span>
                    </li>
                  );
                })}
              </ul>

              {isCurrent ? (
                <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#EEF2FF] text-[#2342B0] text-[12px] font-semibold">
                  <Check size={13} strokeWidth={2.5} />
                  Current Plan
                </div>
              ) : (
                <button
                  className="w-full py-2.5 rounded-xl text-[12px] font-semibold transition-colors"
                  style={{
                    backgroundColor: `${plan.color}14`,
                    color: plan.color,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = plan.color;
                    (e.currentTarget as HTMLButtonElement).style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${plan.color}14`;
                    (e.currentTarget as HTMLButtonElement).style.color = plan.color;
                  }}
                >
                  {PLANS.indexOf(plan) < PLANS.findIndex((p) => p.current)
                    ? "Downgrade"
                    : "Upgrade"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Agent Add-on */}
      <div
        className={clsx(
          "bg-white rounded-[20px] border shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 transition-all",
          agentEnabled
            ? "border-[#7C3AED] shadow-[0_0_0_3px_rgba(124,58,237,0.08)]"
            : "border-[#D9DEE9]"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#7C3AED]/10 flex items-center justify-center shrink-0">
              <Bot size={24} className="text-[#7C3AED]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[16px] font-bold text-[#1F2530]">AI Agent Add-on</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#7C3AED] text-[10px] font-bold">ADD-ON</span>
              </div>
              <p className="text-[13px] text-[#6B7280] max-w-xl">
                Your team AI lives in your WhatsApp group — upload anything, ask it anything, and it remembers everything. Qualifies leads and books inspections 24/7.
              </p>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                {AGENT_ADDON.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <Check size={13} className="mt-0.5 shrink-0 text-[#7C3AED]" strokeWidth={2.5} />
                    <span className="text-[12px] text-[#404754]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[28px] font-bold text-[#1F2530]">
              ${billingPeriod === "annual" ? Math.round(AGENT_ADDON.price * (1 - annualDiscount)) : AGENT_ADDON.price}
              <span className="text-[13px] font-normal text-[#6B7280]">/mo</span>
            </p>
            {billingPeriod === "annual" ? (
              <div className="space-y-0.5 mt-1">
                <p className="text-[11px] text-[#6B7280] line-through">${AGENT_ADDON.price}/mo</p>
                <p className="text-[11px] text-[#6B7280]">${Math.round(AGENT_ADDON.price * (1 - annualDiscount)) * 12}/yr billed annually</p>
                <p className="text-[11px] font-semibold text-[#12B76A]">Save ${(AGENT_ADDON.price - Math.round(AGENT_ADDON.price * (1 - annualDiscount))) * 12}/yr</p>
              </div>
            ) : null}
            <p className="text-[11px] text-[#6B7280] mt-0.5">{AGENT_ADDON.conversations} conversations/mo</p>

            <button
              onClick={() => setAgentEnabled(!agentEnabled)}
              className={clsx(
                "mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors",
                agentEnabled
                  ? "bg-[#FEF2F2] text-[#EF4444] hover:bg-red-100"
                  : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
              )}
            >
              {agentEnabled ? (
                "Remove Add-on"
              ) : (
                <>
                  Add AI Agent
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {agentEnabled && (
          <div className="mt-5 pt-5 border-t border-[#F3F4F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#12B76A] animate-pulse" />
              <span className="text-[12px] font-medium text-[#12B76A]">AI Agent Active</span>
              <span className="text-[12px] text-[#6B7280]">· Configure in Widget Settings</span>
            </div>
            <button className="text-[12px] font-medium text-[#2342B0] hover:underline flex items-center gap-1">
              Configure Agent <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Invoice history placeholder */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
        <h3 className="text-[15px] font-bold text-[#1F2530] mb-4">Invoice History</h3>
        <div className="space-y-3">
          {[
            { date: "1 Jun 2026", desc: "Pro Plan", amount: "$499.00", status: "Paid" },
            { date: "1 May 2026", desc: "Pro Plan", amount: "$499.00", status: "Paid" },
            { date: "1 Apr 2026", desc: "Starter Plan", amount: "$199.00", status: "Paid" },
          ].map((inv) => (
            <div key={inv.date} className="flex items-center justify-between py-3 border-b border-[#F3F4F6] last:border-0">
              <div>
                <p className="text-[13px] font-medium text-[#1F2530]">{inv.desc}</p>
                <p className="text-[11px] text-[#6B7280]">{inv.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-semibold text-[#1F2530]">{inv.amount}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#065F46] text-[11px] font-semibold">{inv.status}</span>
                <button className="text-[12px] text-[#2342B0] hover:underline font-medium">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
