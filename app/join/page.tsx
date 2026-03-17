"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { groupService } from "@/services/group.service";
import { Users, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import Link from "next/link";

type JoinState =
  | { status: "loading" }
  | { status: "confirm" }
  | { status: "joining" }
  | { status: "success"; groupName: string }

  | { status: "expired" }
  | { status: "rate_limited"; retryMinutes: number }
  | { status: "error"; message: string }
  | { status: "no_code" };

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const code = searchParams.get("code")?.toUpperCase().trim() ?? "";

  // Initialize directly to confirm if already authenticated — avoids flash
  const [state, setState] = useState<JoinState>(() => {
    if (!code) return { status: "no_code" };
    return { status: "loading" }; // wait for auth resolution
  });

  useEffect(() => {
    if (authLoading) return;
    if (!code) { setState({ status: "no_code" }); return; }
    if (!isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(`/join?code=${code}`)}`);
      return;
    }
    // Authenticated + have code → show confirm immediately
    setState({ status: "confirm" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated, code]);

  const handleJoin = async () => {
    setState({ status: "joining" });
    try {
      const group = await groupService.join({ inviteCode: code });
      setState({ status: "success", groupName: group.name });
      setTimeout(() => router.push("/dashboard/groups"), 2500);
    } catch (err: any) {
      const msg = err.message ?? "";
      if (msg.toLowerCase().includes("expired")) {
        setState({ status: "expired" });
      } else if (msg.toLowerCase().includes("too many")) {
        const match = msg.match(/(\d+)\s*minute/);
        setState({ status: "rate_limited", retryMinutes: match ? parseInt(match[1]) : 60 });
      } else {
        setState({ status: "error", message: msg || "Something went wrong. Please try again." });
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800;900&display=swap');
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        .anim { animation: slideUp 0.35s ease both; }
      `}</style>

      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
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

          {/* Loading */}
          {state.status === "loading" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <Loader2 size={28} className="text-blue-500 animate-spin" />
              </div>
              <p className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Checking…</p>
            </div>
          )}

          {/* ── Confirm ── */}
          {state.status === "confirm" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
                <Users size={28} className="text-blue-500" strokeWidth={1.75} />
              </div>
              <div>
                <h1 className="text-gray-800 font-black text-xl font-['Sora',sans-serif]">Join this group?</h1>
                <p className="text-gray-400 text-sm mt-2">You're about to join with invite code</p>
                <p className="text-blue-600 font-black text-xl tracking-[0.25em] mt-1">{code}</p>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  All group members will be able to see your expenses added to this group.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => router.push("/dashboard/groups")}
                  className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
                  Cancel
                </button>
                <button onClick={handleJoin}
                  className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]">
                  Yes, Join Group
                </button>
              </div>
            </div>
          )}

          {/* Joining */}
          {state.status === "joining" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto">
                <Loader2 size={28} className="text-blue-500 animate-spin" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Joining group…</h1>
                <p className="text-blue-400 text-sm mt-1">Code: <span className="font-bold tracking-widest">{code}</span></p>
              </div>
            </div>
          )}

          {/* Success */}
          {state.status === "success" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">You're in!</h1>
                <p className="text-blue-500 text-sm mt-1">Welcome to <strong>{state.groupName}</strong></p>
                <p className="text-blue-300 text-xs mt-3">Redirecting to your groups…</p>
              </div>
            </div>
          )}



          {/* Expired */}
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
                className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all">
                Go to My Groups
              </Link>
            </div>
          )}

          {/* Rate limited */}
          {state.status === "rate_limited" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
                <XCircle size={28} className="text-red-400" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Too many attempts</h1>
                <p className="text-blue-400 text-sm mt-1 leading-relaxed">
                  Please try again in <strong>{state.retryMinutes} minute{state.retryMinutes !== 1 ? "s" : ""}</strong>.
                </p>
              </div>
              <Link href="/dashboard"
                className="block w-full py-3 rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all">
                Back to Dashboard
              </Link>
            </div>
          )}

          {/* Error */}
          {state.status === "error" && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
                <XCircle size={28} className="text-red-400" />
              </div>
              <div>
                <h1 className="text-blue-800 font-black text-xl font-['Sora',sans-serif]">Couldn't join</h1>
                <p className="text-blue-400 text-sm mt-1 leading-relaxed">{state.message}</p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard/groups"
                  className="flex-1 py-3 rounded-xl border-2 border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-all text-center">
                  My Groups
                </Link>
                <button onClick={() => setState({ status: "confirm" })}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* No code */}
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
                className="block w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all">
                Go to My Groups
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}