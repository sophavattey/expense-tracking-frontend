"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { groupService } from "@/services/group.service";
import { Users, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

type JoinState =
  | { status: "loading" }
  | { status: "joining" }
  | { status: "success"; groupName: string }
  | { status: "already_member"; groupName: string }
  | { status: "expired" }
  | { status: "rate_limited"; retryMinutes: number }
  | { status: "error"; message: string }
  | { status: "no_code" };

export default function JoinPage() {
  const searchParams    = useSearchParams();
  const router          = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const code = searchParams.get("code")?.toUpperCase().trim() ?? "";

  const [state, setState] = useState<JoinState>({ status: "loading" });
  const hasAttempted = useRef(false); // prevent double-fire from React StrictMode / re-renders

  useEffect(() => {
    // Wait for auth to resolve
    if (authLoading) return;

    // No code in URL
    if (!code) {
      setState({ status: "no_code" });
      return;
    }

    // Not logged in — save the invite URL and redirect to login
    if (!isAuthenticated) {
      const returnTo = `/join?code=${code}`;
      router.replace(`/login?redirect=${encodeURIComponent(returnTo)}`);
      return;
    }

    // Logged in + have code — attempt to join (only once)
    if (hasAttempted.current) return;
    hasAttempted.current = true;
    setState({ status: "joining" });

    groupService.join({ inviteCode: code })
      .then(group => {
        setState({ status: "success", groupName: group.name });
        // Redirect to groups page after 2.5s
        setTimeout(() => router.push("/dashboard/groups"), 2500);
      })
      .catch((err: Error) => {
        const msg = err.message ?? "";

        if (msg.toLowerCase().includes("already a member")) {
          // Try to get the group name from the error or fall back gracefully
          setState({ status: "already_member", groupName: "the group" });
          setTimeout(() => router.push("/dashboard/groups"), 2500);
          return;
        }

        if (msg.toLowerCase().includes("expired")) {
          setState({ status: "expired" });
          return;
        }

        if (msg.toLowerCase().includes("too many")) {
          // Extract minutes from message if present, default 60
          const match = msg.match(/(\d+)\s*minute/);
          setState({ status: "rate_limited", retryMinutes: match ? parseInt(match[1]) : 60 });
          return;
        }

        setState({ status: "error", message: msg || "Something went wrong. Please try again." });
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, code]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .anim { animation: slideUp 0.35s ease both; }
      `}</style>

      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-100 w-full max-w-sm p-8 text-center anim">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-blue-800 font-black text-lg font-['Sora',sans-serif]">
              Fin<span className="text-blue-500">Set</span>
            </span>
          </Link>

          {/* ── Loading / auth check ── */}
          {(state.status === "loading" || state.status === "joining") && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <Loader2 size={28} className="text-blue-500 animate-spin" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">
                  {state.status === "loading" ? "Checking…" : "Joining group…"}
                </h1>
                <p className="text-blue-400 text-sm mt-1">
                  {state.status === "joining" && code && (
                    <>Code: <span className="font-bold tracking-widest">{code}</span></>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {state.status === "success" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">You're in!</h1>
                <p className="text-blue-500 text-sm mt-1">
                  Welcome to <strong>{state.groupName}</strong>
                </p>
                <p className="text-blue-300 text-xs mt-3">Redirecting to your groups…</p>
              </div>
            </div>
          )}

          {/* ── Already a member ── */}
          {state.status === "already_member" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto">
                <Users size={28} className="text-indigo-500" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Already a member</h1>
                <p className="text-blue-400 text-sm mt-1">You're already in this group.</p>
                <p className="text-blue-300 text-xs mt-3">Taking you there now…</p>
              </div>
            </div>
          )}

          {/* ── Expired ── */}
          {state.status === "expired" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto">
                <Clock size={28} className="text-amber-500" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Code expired</h1>
                <p className="text-blue-400 text-sm mt-1 leading-relaxed">
                  This invite link has expired. Ask the group owner to generate a new one.
                </p>
              </div>
              <Link href="/dashboard/groups"
                className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all mt-2">
                Go to My Groups
              </Link>
            </div>
          )}

          {/* ── Rate limited ── */}
          {state.status === "rate_limited" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
                <XCircle size={28} className="text-red-400" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Too many attempts</h1>
                <p className="text-blue-400 text-sm mt-1 leading-relaxed">
                  Too many join attempts from your location. Please try again in{" "}
                  <strong>{state.retryMinutes} minute{state.retryMinutes !== 1 ? "s" : ""}</strong>.
                </p>
              </div>
              <Link href="/dashboard"
                className="block w-full py-3 rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all mt-2">
                Back to Dashboard
              </Link>
            </div>
          )}

          {/* ── Error ── */}
          {state.status === "error" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
                <XCircle size={28} className="text-red-400" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Couldn't join</h1>
                <p className="text-blue-400 text-sm mt-1 leading-relaxed">{state.message}</p>
              </div>
              <div className="flex gap-3 mt-2">
                <Link href="/dashboard/groups"
                  className="flex-1 py-3 rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all text-center">
                  My Groups
                </Link>
                <button onClick={() => window.location.reload()}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* ── No code ── */}
          {state.status === "no_code" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <Users size={28} className="text-blue-400" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Invalid link</h1>
                <p className="text-blue-400 text-sm mt-1">This invite link is missing a code. Check the link and try again.</p>
              </div>
              <Link href="/dashboard/groups"
                className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all mt-2">
                Go to My Groups
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}