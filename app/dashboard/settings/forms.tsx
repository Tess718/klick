"use client"; 

import { useState } from "react";
import { updateEmail, updatePassword, deleteAccount, updateProfile } from "@/actions/settings";
import { UserIcon, EnvelopeIcon, LockClosedIcon, TrashIcon, EyeIcon, EyeSlashIcon, CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export function SettingsForms({ email, name }: { email: string, name: string | null }) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileForm currentName={name} />
      <EmailForm currentEmail={email} />
      <PasswordForm />
      <DangerZone />
    </div>
  );
}

function ProfileForm({ currentName }: { currentName: string | null }) {
  const [status, setStatus] = useState<{ error?: string; success?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus({});
    const result = await updateProfile(formData);
    if (result.error) {
      setStatus({ error: result.error });
    } else {
      setStatus({ success: result.message });
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
          <UserIcon className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <CardTitle className="text-lg">Your Name</CardTitle>
          <CardDescription>Currently: {currentName || "Not set"}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            name="name"
            defaultValue={currentName || ""}
            placeholder="Jane Doe"
            required
            className="w-full"
          />
          <StatusMessage {...status} />
          <Button
            type="submit"
            disabled={loading}
            className="w-fit"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Name"}
          </Button>
        </form>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
          <EnvelopeIcon className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <CardTitle className="text-lg">Email Address</CardTitle>
          <CardDescription>Currently: {currentEmail}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            name="newEmail"
            placeholder="New email address"
            required
            className="w-full"
          />
          <StatusMessage {...status} />
          <Button
            type="submit"
            disabled={loading}
            className="w-fit"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center shrink-0">
          <LockClosedIcon className="w-5 h-5 text-violet-500" />
        </div>
        <div>
          <CardTitle className="text-lg">Change Password</CardTitle>
          <CardDescription>Update your password</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              placeholder="Current password"
              required
              className="pr-10"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showCurrent ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              name="newPassword"
              placeholder="New password"
              required
              className="pr-10"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showNew ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              className="pr-10"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirm ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>

          <StatusMessage {...status} />
          <Button
            type="submit"
            disabled={loading}
            className="w-fit"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
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
    <Card className="border-destructive/50">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
          <TrashIcon className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {!confirming ? (
          <Button
            variant="destructive"
            onClick={() => setConfirming(true)}
          >
            Delete Account
          </Button>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-destructive">
              This will permanently delete your account, all your links, and all analytics data. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</> : "Yes, Delete Everything"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
