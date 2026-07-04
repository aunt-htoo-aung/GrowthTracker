import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Box, Button } from "../components/UIElements";
import { User, Mail, Calendar, Edit2, Save, X, ChevronRight, Shield } from "lucide-react";

export default function Profile() {
  const { user, updateProfile, loading, error, clearError } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, bio });
      setEditing(false);
    } catch {
      // error is set in context
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setEditing(false);
    clearError();
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently joined";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-4 sm:mb-6">
          <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-500">Profile</span>
        </nav>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <Box className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">{user?.name || "User"}</h1>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Mail size={13} />
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Calendar size={12} />
                  Member since {memberSince}
                </p>
              </div>
            </div>

            {!editing && (
              <Button variant="secondary" onClick={() => setEditing(true)} className="text-xs">
                <Edit2 size={14} />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <User size={14} />
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                />
              ) : (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                  {user?.name || "Not set"}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Shield size={14} />
                Bio
              </label>
              {editing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Tell us about yourself and what you're learning..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition resize-none"
                />
              ) : (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100 min-h-[60px]">
                  {user?.bio || "No bio yet. Click edit to add one."}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Mail size={14} />
                Email
              </label>
              <p className="text-sm text-slate-500 bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                {user?.email || "user@example.com"}
                <span className="text-xs text-slate-400 ml-2">(cannot be changed)</span>
              </p>
            </div>
          </div>

          {/* Edit Actions */}
          {editing && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
              <Button
                onClick={handleSave}
                disabled={saving || !name.trim()}
                className={`text-xs ${(saving || !name.trim()) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Save size={14} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="secondary" onClick={handleCancel} className="text-xs">
                <X size={14} />
                Cancel
              </Button>
            </div>
          )}
        </Box>

        {/* Account Actions */}
        <div className="mt-6">
          <Box className="p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Account</h2>
            <div className="space-y-3">
              <Link
                to="/change-password"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
              >
                <span className="text-sm text-slate-700">Change Password</span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600" />
              </Link>
              <Link
                to="/delete-account"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-red-50 transition group"
              >
                <span className="text-sm text-red-600">Delete Account</span>
                <ChevronRight size={16} className="text-red-300 group-hover:text-red-500" />
              </Link>
            </div>
          </Box>
        </div>
      </main>
    </div>
  );
}
