"use client";

import { MapPin, Lock, TrendingDown, Target, Users, ArrowLeftRight, BarChart2, Tag } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it Works", href: "#how-it-works" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Expense Tracking", href: "#features" },
      { label: "Budget Management", href: "#features" },
      { label: "Group Budgets", href: "#features" },
      { label: "KHR + USD Support", href: "#features" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const featureStrip = [
  { Icon: TrendingDown, label: "Expense Tracking" },
  { Icon: Target,       label: "Budget Alerts"    },
  { Icon: Users,        label: "Group Budgets"     },
  { Icon: ArrowLeftRight, label: "KHR & USD"       },
];

export default function Footer() {
  return (
    <footer className="bg-blue-900 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">

        {/* Top grid */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-white font-black text-xl font-['Sora',sans-serif]">
                Fin<span className="text-blue-400">Set</span>
              </span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-6">
              Cambodia's personal finance tracker. Smart budgeting for the KHR & USD dual-currency economy.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-blue-800 border border-blue-700 text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                <MapPin size={11} strokeWidth={2} />
                Made in Cambodia
              </span>
              <span className="inline-flex items-center gap-1.5 bg-blue-800 border border-blue-700 text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                <Lock size={11} strokeWidth={2} />
                Secure
              </span>
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {[
                { label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { label: "Twitter",  path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { label: "Telegram", path: "M21.198 2.433a2.242 2.242 0 00-1.022.215l-16.5 6.666a2.25 2.25 0 00.126 4.238l3.998 1.261 1.562 5.239a.75.75 0 001.189.338l2.279-1.914 3.936 3.063a2.249 2.249 0 003.5-1.338L22.5 4.5a2.242 2.242 0 00-1.302-2.067z" },
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-blue-800 hover:bg-blue-700 border border-blue-700 hover:border-blue-500 flex items-center justify-center transition-all">
                  <svg className="w-3.5 h-3.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="text-blue-400 text-[11px] font-bold uppercase tracking-widest mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-blue-300 text-sm hover:text-white transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Feature strip */}
        <div className="border-t border-blue-800 border-b py-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featureStrip.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-800 flex items-center justify-center shrink-0">
                  <Icon size={13} strokeWidth={2} className="text-blue-400" />
                </div>
                <span className="text-blue-300 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-blue-500 text-sm">
            <MapPin size={13} strokeWidth={2} className="text-blue-600" />
            <span>© {new Date().getFullYear()} FinSet. Made in Phnom Penh, Cambodia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-500 text-xs">Available in</span>
            <span className="bg-blue-800 border border-blue-700 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg">EN</span>
            <span className="bg-blue-800 border border-blue-700 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-lg">ខ្មែរ</span>
          </div>
        </div>

      </div>
    </footer>
  );
}