"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/Toast";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  // Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  // Change password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        router.push("/login");
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);
      setEmail(currentUser.email || "");
      
      // Get user metadata if exists
      const displayName = currentUser.user_metadata?.full_name || 
                         currentUser.user_metadata?.name || 
                         "";
      setName(displayName);
      
    } catch (err: any) {
      console.error("Error loading user data:", err);
      setError("Error loading user data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { user: currentUser }, error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          name: name,
        },
      });

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Validations
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setSaving(false);
      return;
    }

    try {
      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error changing password:", err);
      setError(err.message || "Error changing password");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (!confirm("Are you sure you want to sign out?")) {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error("Error signing out:", err);
      showToast("Error signing out. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-blue-600">settings</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-11">
            Manage your account preferences
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-3xl text-blue-600">settings</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-sm sm:text-base text-gray-600 ml-11">
          Manage your account preferences
        </p>
      </div>

      {/* Success/error messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-600">{success}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 space-y-6">
        {/* Profile */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="your@email.com"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed from here
              </p>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">Security</h2>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Confirm your new password"
                  minLength={6}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setError(null);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Information */}
        <div className="border-t pt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User ID:</span>
              <span className="text-gray-900 font-mono text-xs">{user?.id || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account created:</span>
              <span className="text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last updated:</span>
              <span className="text-gray-900">
                {user?.updated_at
                  ? new Date(user.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="border-t pt-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Sign Out</h2>
          <button
            onClick={handleSignOut}
            className="bg-gray-200 text-gray-700 px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium text-sm sm:text-base"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}



