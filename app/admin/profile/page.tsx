"use client";

import React, { useState } from "react";
import Shell from "@/app/components/Shell";
import useAuthStore from "@/stores/authStore";

export default function AdminProfile() {
  const { user } = useAuthStore();

  // States for Email form
  const [email, setEmail] = useState(user?.email || "admin@lms.com");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // States for Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // States for OTP setup
  const [isOtpEnabled, setIsOtpEnabled] = useState(false); // Mock current state
  const [isUpdatingOtp, setIsUpdatingOtp] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingEmail(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Email updated successfully!");
    } catch (error) {
      alert("Failed to update email.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match!");
    }
    setIsUpdatingPassword(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleToggleOtp = async () => {
    setIsUpdatingOtp(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpEnabled(!isOtpEnabled);
      alert(isOtpEnabled ? "OTP Authentication disabled." : "OTP Authentication enabled.");
    } catch (error) {
      alert("Failed to update OTP settings.");
    } finally {
      setIsUpdatingOtp(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 36,
    padding: "0 10px",
    marginBottom: 16,
    fontSize: 13,
    border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 4,
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.10)",
    marginBottom: 20,
    maxWidth: 600,
  };

  return (
    <Shell>
      <h1 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 20px 0" }}>
        Admin Profile
      </h1>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, margin: "0 0 16px 0", borderBottom: "1px solid #eee", paddingBottom: 8 }}>
          Email Preferences
        </h2>
        <form onSubmit={handleUpdateEmail}>
          <label style={labelStyle}>Current Email Address</label>
          <input
            type="email"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isUpdatingEmail}
            style={{
              padding: "8px 16px",
              backgroundColor: "#B8860B",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              cursor: isUpdatingEmail ? "not-allowed" : "pointer",
              opacity: isUpdatingEmail ? 0.7 : 1,
            }}
          >
            {isUpdatingEmail ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, margin: "0 0 16px 0", borderBottom: "1px solid #eee", paddingBottom: 8 }}>
          Change Password
        </h2>
        <form onSubmit={handleUpdatePassword}>
          <label style={labelStyle}>Current Password</label>
          <input
            type="password"
            style={inputStyle}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <label style={labelStyle}>New Password</label>
          <input
            type="password"
            style={inputStyle}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
          <label style={labelStyle}>Confirm New Password</label>
          <input
            type="password"
            style={inputStyle}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isUpdatingPassword}
            style={{
              padding: "8px 16px",
              backgroundColor: "#B8860B",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontSize: 13,
              cursor: isUpdatingPassword ? "not-allowed" : "pointer",
              opacity: isUpdatingPassword ? 0.7 : 1,
            }}
          >
            {isUpdatingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div style={sectionStyle}>
        <h2 style={{ fontSize: 15, margin: "0 0 8px 0", borderBottom: "1px solid #eee", paddingBottom: 8 }}>
          Two-Factor Authentication (OTP)
        </h2>
        <p style={{ fontSize: 13, color: "#777", marginBottom: 16 }}>
          Protect your admin account with an extra layer of security. When enabled, you will be required to enter an OTP sent to your email or phone upon login.
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", backgroundColor: "#f9f9f7", borderRadius: 4, border: "1px solid #eee" }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#333", display: "block", marginBottom: 4 }}>
              OTP Authentication
            </span>
            <span style={{ fontSize: 12, color: isOtpEnabled ? "#2E7D32" : "#C62828", fontWeight: 500 }}>
              {isOtpEnabled ? "Currently Enabled" : "Currently Disabled"}
            </span>
          </div>
          <button
            type="button"
            onClick={handleToggleOtp}
            disabled={isUpdatingOtp}
            style={{
              padding: "8px 16px",
              backgroundColor: isOtpEnabled ? "#fff" : "#B8860B",
              color: isOtpEnabled ? "#C62828" : "#fff",
              border: isOtpEnabled ? "1px solid #C62828" : "none",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 500,
              cursor: isUpdatingOtp ? "not-allowed" : "pointer",
              opacity: isUpdatingOtp ? 0.7 : 1,
            }}
          >
            {isUpdatingOtp ? "Processing..." : (isOtpEnabled ? "Disable OTP" : "Enable OTP")}
          </button>
        </div>
      </div>
    </Shell>
  );
}
