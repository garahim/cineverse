"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { ok: false });
  const search = useSearchParams();
  const next = search.get("next") ?? "/";

  return (
    <div className="mx-auto mt-16 w-full max-w-md px-4 sm:mt-24">
      <h1 className="text-center font-display text-3xl font-extrabold text-white">
        Welcome <span className="text-gradient">back</span>
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Log in to your CineVerse account
      </p>

      <form action={formAction} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-card p-8 shadow-2xl shadow-violet-500/10">
        <input type="hidden" name="next" value={next} />
        <div>
          <label htmlFor="identifier" className="text-sm font-medium text-slate-300">
            Username or email
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username email"
            required
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
            placeholder="your_username or email"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
            placeholder="••••••••"
          />
        </div>
        {state.message && (
          <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{state.message}</p>
        )}
        <button
          disabled={pending}
          className="btn-primary w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Logging in…" : "Log in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-violet-300 hover:text-violet-200">
          Sign up
        </Link>
      </p>
    </div>
  );
}