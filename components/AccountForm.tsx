"use client";

import { useState } from "react";
import { useActionState, useTransition } from "react";
import { updateAccountAction, deleteAccountAction } from "@/lib/actions";
import { AVATAR_COLORS } from "@/lib/utils";
import type { SafeUser } from "@/lib/types";

export default function AccountForm({ user }: { user: SafeUser }) {
  const [state, formAction, pending] = useActionState(updateAccountAction, { ok: false });
  const [color, setColor] = useState(user.avatarColor);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, startDelete] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form action={formAction} className="space-y-5 rounded-2xl border border-white/10 bg-card p-6 lg:col-span-2">
        <div>
          <h2 className="font-display text-lg font-bold text-white">Edit profile</h2>
          <p className="mt-1 text-sm text-slate-500">Update your public profile details.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="username" className="text-sm font-medium text-slate-300">
              Username
            </label>
            <input
              id="username"
              name="username"
              defaultValue={user.username}
              className="input-dark mt-2 w-full rounded-xl px-4 py-2.5 text-sm text-white"
            />
            {state.errors?.username && <p className="mt-1 text-xs text-rose-400">{state.errors.username}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              value={user.email}
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-xl border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-slate-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="text-sm font-medium text-slate-300">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            maxLength={240}
            defaultValue={user.bio}
            placeholder="Tell people what you love to watch…"
            className="input-dark mt-2 w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500"
          />
        </div>

        <div>
          <span className="text-sm font-medium text-slate-300">Avatar color</span>
          <input type="hidden" name="avatarColor" value={color} />
          <div className="mt-3 flex flex-wrap gap-2">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Choose ${c}`}
                className={`h-9 w-9 rounded-full transition-transform ${
                  color === c ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-card" : "hover:scale-110"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        <hr className="border-white/8" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="currentPassword" className="text-sm font-medium text-slate-300">
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              className="input-dark mt-2 w-full rounded-xl px-4 py-2.5 text-sm text-white"
            />
            {state.errors?.currentPassword && <p className="mt-1 text-xs text-rose-400">{state.errors.currentPassword}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="text-sm font-medium text-slate-300">
              New password <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              className="input-dark mt-2 w-full rounded-xl px-4 py-2.5 text-sm text-white"
            />
            {state.errors?.newPassword && <p className="mt-1 text-xs text-rose-400">{state.errors.newPassword}</p>}
          </div>
        </div>

        {state.message && (
          <p className={`text-sm ${state.ok ? "text-emerald-400" : "text-rose-400"}`}>{state.message}</p>
        )}

        <button
          disabled={pending}
          className="btn-primary rounded-full px-7 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="h-fit rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
        <h2 className="font-display text-lg font-bold text-rose-300">Danger zone</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Permanently delete your account, ratings, reviews and watchlist. This cannot be undone.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="mt-4 rounded-full border border-rose-500/40 px-5 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/10"
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-rose-200">Are you sure? This is permanent.</p>
            <button
              disabled={isDeleting}
              onClick={() => startDelete(async () => { await deleteAccountAction(); })}
              className="w-full rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Yes, delete everything"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-full rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-slate-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}