"use client";

import { useInView } from "@/hooks/useInView";
import {
  LayoutDashboard, Target, Users, ArrowLeftRight, BarChart2, Tag, type LucideIcon,
} from "lucide-react";

interface Feature {
  Icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  delay: number;
}

const features: Feature[] = [
  {
    Icon: LayoutDashboard,
    title: "Smart Expense Tracking",
    description: "Log every purchase with merchant, category, date and payment method. View spending by month with beautiful charts and full transaction history.",
    accent: "bg-blue-600", delay: 0,
  },
  {
    Icon: Target,
    title: "Budget Management",
    description: "Set daily, weekly, or monthly budgets per category. Color-coded progress bars and real-time alerts keep you from overspending.",
    accent: "bg-green-500", delay: 80,
  },
  {
    Icon: Users,
    title: "Group Budgets",
    description: "Create shared budget groups for families or friends. Track group expenses together, see who spent what, and manage shared limits with invite links.",
    accent: "bg-indigo-600", delay: 160,
  },
  {
    Icon: ArrowLeftRight,
    title: "KHR + USD Dual Currency",
    description: "Cambodia runs on two currencies. FinSet tracks both seamlessly — every expense shows in KHR and USD simultaneously at a fixed exchange rate.",
    accent: "bg-amber-500", delay: 240,
  },
  {
    Icon: BarChart2,
    title: "Spending Analytics",
    description: "Monthly bar charts, donut breakdowns by category, and month-over-month comparisons give you a clear picture of your financial habits.",
    accent: "bg-cyan-500", delay: 320,
  },
  {
    Icon: Tag,
    title: "Custom Categories",
    description: "Create your own spending categories with custom icons and colors. Organize expenses exactly the way you think about your money.",
    accent: "bg-rose-500", delay: 400,
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const { ref, inView } = useInView();
  const { Icon, title, description, accent, delay } = feature;

  return (
    <div ref={ref}
      className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.3s, border-color 0.3s`,
      }}>
      <div className={`w-11 h-11 rounded-xl ${accent} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
        <Icon size={20} strokeWidth={1.75} className="text-white" />
      </div>
      <h3 className="text-gray-800 font-bold text-[15px] mb-2 font-['Sora',sans-serif]">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Everything You Need</span>
          <h2 className="text-4xl font-black text-gray-800 mt-3 font-['Sora',sans-serif]">
            Powerful Features,<br />Simple Interface
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Built specifically for the Cambodian financial context — dual currency, group spending, and smart budgets all in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => <FeatureCard key={f.title} feature={f} />)}
        </div>
        <div className="mt-14 text-center">
          <a href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:scale-95 text-sm">
            Start Tracking Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}