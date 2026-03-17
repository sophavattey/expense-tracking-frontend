"use client";

import { useInView } from "@/hooks/useInView";

interface Plan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    desc: "Perfect for getting started",
    features: [
      "Up to 50 transactions/mo",
      "2 budget categories",
      "KHR + USD support",
      "Basic reports",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$3",
    period: "/month",
    desc: "For serious budgeters",
    features: [
      "Unlimited transactions",
      "Unlimited categories",
      "KHQR auto-scan",
      "Advanced analytics",
      "Export to CSV/PDF",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Family",
    price: "$6",
    period: "/month",
    desc: "Share with up to 5 members",
    features: [
      "Everything in Pro",
      "Up to 5 accounts",
      "Shared budgets",
      "Family dashboard",
      "Spending alerts",
    ],
    cta: "Start Family Trial",
    highlighted: false,
  },
];

function PlanCard({ plan, index }: { plan: Plan; index: number }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}
      className={`relative rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        plan.highlighted
          ? "bg-blue-600 border-blue-600 shadow-2xl shadow-blue-600/30"
          : "bg-white border-blue-100 hover:border-blue-200 hover:shadow-blue-100/60"
      }`}
    >
      {/* Most popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
          Most Popular
        </div>
      )}

      {/* Plan name & description */}
      <p
        className={`font-black text-lg mb-1 font-['Sora',sans-serif] ${
          plan.highlighted ? "text-white" : "text-blue-800"
        }`}
      >
        {plan.name}
      </p>
      <p
        className={`text-sm mb-6 ${
          plan.highlighted ? "text-blue-200" : "text-blue-400"
        }`}
      >
        {plan.desc}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-8">
        <span
          className={`text-4xl font-black font-['Sora',sans-serif] ${
            plan.highlighted ? "text-white" : "text-blue-800"
          }`}
        >
          {plan.price}
        </span>
        <span
          className={`text-sm ${
            plan.highlighted ? "text-blue-300" : "text-blue-400"
          }`}
        >
          {plan.period}
        </span>
      </div>

      {/* Feature list */}
      <ul className="space-y-3 mb-8">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <svg
              className={`w-4 h-4 mt-0.5 shrink-0 ${
                plan.highlighted ? "text-green-300" : "text-green-500"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span
              className={`text-sm ${
                plan.highlighted ? "text-blue-100" : "text-blue-500"
              }`}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <a
        href="/signup"
        className={`block text-center py-3 rounded-2xl font-bold text-sm transition-all ${
          plan.highlighted
            ? "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
        }`}
      >
        {plan.cta}
      </a>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-bold uppercase tracking-widest">
            Simple Pricing
          </span>
          <h2 className="text-4xl font-black text-blue-800 mt-3 font-['Sora',sans-serif]">
            Plans for Everyone
          </h2>
          <p className="text-blue-400 mt-4">
            Start free. Upgrade when you need more.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <PlanCard key={plan.name} plan={plan} index={i} />
          ))}
        </div>

        {/* Money-back note */}
        <p className="text-center text-blue-400 text-sm mt-10">
          🔒 All paid plans come with a{" "}
          <strong className="text-blue-600">14-day free trial</strong>. No credit card required.
        </p>
      </div>
    </section>
  );
}