"use client"; 

import { useState } from "react";
import { updateEmail, updatePassword, deleteAccount } from "@/actions/settings";
import { EnvelopeIcon, LockClosedIcon, TrashIcon, EyeIcon, EyeSlashIcon, CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

function StatusMessage({ error, success }: { error?: string; success?: string }) {
  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2.5 rounded-lg text-sm">
        <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
        {error}
      </div>
    );
  }
  if (success) {
    return (
      <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-4 py-2.5 rounded-lg text-sm">
        <CheckIcon className="w-4 h-4 flex-shrink-0" />
        {success}
      </div>
    );
  }
  return null;
}

export function SettingsForms({ email }: { email: string }) {
  return (
    <div className="flex flex-col gap-6">
      <EmailForm currentEmail={email} />
      <PasswordForm />
      <DangerZone />
    </div>
  );
}

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus({});
    const result = await updateEmail(formData);
    if (result.error) {
      setStatus({ error: result.error });
    } else {
      setStatus({ success: result.message });
    }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <EnvelopeIcon className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Email Address</h2>
          <p className="text-sm text-zinc-500">Currently: {currentEmail}</p>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="newEmail"
          placeholder="New email address"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        />
        <StatusMessage {...status} />
        <button
          type="submit"
          disabled={loading}
          className="self-start px-5 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Email"}
        </button>
      </form>
    </div>
  );
}

function PasswordForm() {
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus({});
    const result = await updatePassword(formData);
    if (result.error) {
      setStatus({ error: result.error });
    } else {
      setStatus({ success: result.message });
    }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
          <LockClosedIcon className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Change Password</h2>
          <p className="text-sm text-zinc-500">Update your password</p>
        </div>
      </div>

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            name="currentPassword"
            placeholder="Current password"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 pr-10"
          />
          <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            {showCurrent ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            name="newPassword"
            placeholder="New password"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 pr-10"
          />
          <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            {showNew ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm new password"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 pr-10"
          />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
        </div>

        <StatusMessage {...status} />
        <button
          type="submit"
          disabled={loading}
          className="self-start px-5 py-2.5 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteAccount();
  }

  return (
    <div className="bg-white border border-red-200 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
          <TrashIcon className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
          <p className="text-sm text-zinc-500">Permanently delete your account and all data</p>
        </div>
      </div>

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-red-500 font-medium">
            This will permanently delete your account, all your links, and all analytics data. This action cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Yes, Delete Everything"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="px-5 py-2.5 bg-zinc-100 text-zinc-700 rounded-lg font-medium hover:bg-zinc-200:bg-zinc-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
