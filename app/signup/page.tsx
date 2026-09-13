"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions";

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(registerAction, { ok: false });

  return (
    <div className="mx-auto mt-16 w-full max-w-md px-4 sm:mt-24">
      <h1 className="text-center font-display text-3xl font-extrabold text-white">
        Create your <span className="text-gradient">CineVerse</span> account
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Start rating, reviewing and building your watchlist today.
      </p>

      <form action={formAction} className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-card p-8 shadow-2xl shadow-violet-500/10">
        <input type="hidden" name="next" value="/" />
        <div>
          <label htmlFor="username" className="text-sm font-medium text-slate-300">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minLength={3}
            maxLength={24}
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
            placeholder="your_username"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
            placeholder="you@email.com"
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
            required
            minLength={6}
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
            placeholder="6 characters minimum"
          />
        </div>
        <div>
          <label htmlFor="confirm" className="text-sm font-medium text-slate-300">
            Confirm password
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
            placeholder="Type your password again"
          />
        </div>
        {state.message && (
          <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{state.message}</p>
        )}
        <button
          disabled={pending}
          className="btn-primary w-full rounded-full py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-violet-300 hover:text-violet-200">
          Log in
        </Link>
      </p>
    </div>
  );
}