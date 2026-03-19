"use client";

import { useInView } from "@/hooks/useInView";

interface Step {
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Create Your Account",
    desc: "Sign up in seconds with email or Google. Set your preferred currency and you're ready to go.",
  },
  {
    num: "02",
    title: "Set Your Budgets",
    desc: "Define monthly limits for Food, Transport, Shopping, and more. FinSet uses these to keep you on track.",
  },
  {
    num: "03",
    title: "Log Your Expenses",
    desc: "Add expenses manually by category, amount, and payment method. Supports both USD and KHR.",
  },
  {
    num: "04",
    title: "Watch Your Progress",
    desc: "Real-time dashboards show your financial health. Celebrate savings, fix overspending, grow wealth.",
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 120}ms, transform 0.6s ease ${index * 120}ms`,
      }}>
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-6 left-[calc(100%-8px)] w-full h-px bg-gradient-to-r from-blue-200 to-transparent z-0" />
      )}
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-lg shadow-blue-600/25 font-['Sora',sans-serif]">
          {step.num.replace("0", "")}
        </div>
        <h3 className="text-gray-800 font-bold text-base mb-2 font-['Sora',sans-serif]">{step.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: `radial-gradient(circle, #2563eb 1px, transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">Simple Setup</span>
          <h2 className="text-4xl font-black text-gray-800 mt-3 font-['Sora',sans-serif]">
            Up and Running<br />in 4 Steps
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Getting started with FinSet takes less than two minutes. Here's how it works.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => <StepCard key={step.num} step={step} index={i} />)}
        </div>
        <div className="text-center mt-16">
          <a href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 text-sm">
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}