"use client";

import Link from "next/link";

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Changelog", "Roadmap"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Press"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Privacy", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-blue-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-white font-black text-xl font-['Sora',sans-serif]">
                Fin<span className="text-blue-400">Set</span>
              </span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-5">
              Cambodia's #1 personal finance tracker. Smart budgeting for the dual-currency economy.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                {
                  label: "Facebook",
                  path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
                },
                {
                  label: "Twitter",
                  path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                },
                {
                  label: "Telegram",
                  path: "M21.198 2.433a2.242 2.242 0 00-1.022.215l-16.5 6.666a2.25 2.25 0 00.126 4.238l3.998 1.261 1.562 5.239a.75.75 0 001.189.338l2.279-1.914 3.936 3.063a2.249 2.249 0 003.5-1.338L22.5 4.5a2.242 2.242 0 00-1.302-2.067z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-blue-700 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-blue-300 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-700/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-blue-400 text-sm">
            © {new Date().getFullYear()} FinSet. Made with ❤️ in Phnom Penh, Cambodia 🇰🇭
          </p>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 text-xs">Available in</span>
            <span className="bg-blue-700 text-blue-200 text-xs font-bold px-2 py-1 rounded-lg">
              EN
            </span>
            <span className="bg-blue-700 text-blue-200 text-xs font-bold px-2 py-1 rounded-lg">
              ខ្មែរ
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}