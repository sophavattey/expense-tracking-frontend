"use client";

import { useInView } from "@/hooks/useInView";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  accent: string;
  delay: number;
}

function FeatureCard({ icon, title, description, accent, delay }: FeatureCardProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className="group relative bg-white rounded-2xl p-6 border border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-500 overflow-hidden"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* Gradient corner glow */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 ${accent} rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
      />
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-blue-800 font-bold text-lg mb-2 font-['Sora',sans-serif]">
        {title}
      </h3>
      <p className="text-blue-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

const features: FeatureCardProps[] = [
  {
    icon: "📊",
    title: "Smart Expense Tracking",
    description:
      "Automatically categorize every purchase — coffee, groceries, rent. See where your money goes in real time with beautiful visual breakdowns.",
    accent: "bg-blue-400",
    delay: 0,
  },
  {
    icon: "🎯",
    title: "Budget Management",
    description:
      "Set monthly budgets per category and get notified before you overspend. Stay in control with daily and weekly summaries.",
    accent: "bg-green-400",
    delay: 100,
  },
  {
    icon: "📱",
    title: "KHQR Auto Logging",
    description:
      "Scan any KHQR receipt and FinSet instantly logs the transaction — merchant, amount, and category. No manual entry ever again.",
    accent: "bg-blue-500",
    delay: 200,
  },
  {
    icon: "🇰🇭",
    title: "Cambodia-Focused",
    description:
      "Built for Cambodians. Supports Khmer language, local merchants, and integrates with the Bakong payment ecosystem natively.",
    accent: "bg-yellow-400",
    delay: 300,
  },
  {
    icon: "💱",
    title: "KHR + USD Dual Currency",
    description:
      "Cambodia runs on two currencies. FinSet handles both seamlessly — switch views, see live exchange rates, and budget in either.",
    accent: "bg-green-400",
    delay: 400,
  },
  {
    icon: "📈",
    title: "Spending Analytics",
    description:
      "Weekly and monthly reports, trend charts, and AI-powered insights help you build smarter financial habits over time.",
    accent: "bg-blue-300",
    delay: 500,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-blue-400 text-sm font-bold uppercase tracking-widest">
            Everything You Need
          </span>
          <h2 className="text-4xl font-black text-blue-800 mt-3 font-['Sora',sans-serif]">
            Powerful Features,
            <br />
            Simple Interface
          </h2>
          <p className="text-blue-400 mt-4 max-w-xl mx-auto">
            Built specifically for the Cambodian financial context, with all the tools you need to
            take control of your money.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}