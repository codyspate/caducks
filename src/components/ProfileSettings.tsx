import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

interface UserWithDisplayName {
  name: string;
  email: string;
  image?: string | null;
  displayName?: string | null;
  twoFactorEnabled?: boolean | null;
}

export default function ProfileSettings() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-40 bg-neutral-800 rounded-xl" />
        <div className="h-40 bg-neutral-800 rounded-xl" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as UserWithDisplayName;

  return (
    <div className="space-y-8">
      <DisplayNameSection user={user} />
      <PasswordSection />
      <TwoFactorSection user={user} />
    </div>
  );
}

function DisplayNameSection({ user }: { user: UserWithDisplayName }) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await authClient.updateUser({
        displayName: displayName || null,
      });

      if (error) {
        setMessage({ type: "error", text: error.message || "Update failed" });
      } else {
        setMessage({ type: "success", text: "Display name updated" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-container">
      <h2 className="text-xl font-bold text-neutral-100 mb-4">Display Name</h2>
      <p className="text-sm text-neutral-400 mb-4">
        Set a display name to show instead of your account name ({user.name}).
        Leave blank to use your account name.
      </p>
      <div className="space-y-4">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter display name"
          className="input-field"
        />
        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-emerald-500" : "text-red-400"}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary py-2 px-4"
        >
          {isLoading ? "Saving..." : "Save Display Name"}
        </button>
      </div>
    </section>
  );
}

function PasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChangePassword = async () => {
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Password change failed",
        });
      } else {
        setMessage({ type: "success", text: "Password changed successfully" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-container">
      <h2 className="text-xl font-bold text-neutral-100 mb-4">
        Change Password
      </h2>
      <div className="space-y-4">
        <label className="block">
          <span className="form-label">Current Password</span>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="block">
          <span className="form-label">New Password</span>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-field"
          />
        </label>
        <label className="block">
          <span className="form-label">Confirm New Password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
          />
        </label>
        {message && (
          <p
            className={`text-sm ${message.type === "success" ? "text-emerald-500" : "text-red-400"}`}
          >
            {message.text}
          </p>
        )}
        <button
          type="button"
          onClick={handleChangePassword}
          disabled={isLoading || !currentPassword || !newPassword}
          className="btn-primary py-2 px-4"
        >
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </section>
  );
}

function TwoFactorSection({ user }: { user: UserWithDisplayName }) {
  const [isEnabled, setIsEnabled] = useState(user.twoFactorEnabled ?? false);
  const [step, setStep] = useState<"idle" | "setup" | "verify">("idle");
  const [password, setPassword] = useState("");
  const [totpUri, setTotpUri] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleEnable = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await authClient.twoFactor.enable({
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to enable 2FA",
        });
        setIsLoading(false);
        return;
      }

      // Store backup codes from enable response
      if (data?.backupCodes) {
        setBackupCodes(data.backupCodes);
      }

      // Get TOTP URI for QR code
      const { data: uriData, error: uriError } =
        await authClient.twoFactor.getTotpUri({
          password,
        });

      if (uriError || !uriData?.totpURI) {
        setMessage({ type: "error", text: "Failed to get setup code" });
        setIsLoading(false);
        return;
      }

      setTotpUri(uriData.totpURI);
      setStep("verify");
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: verifyCode,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Invalid code",
        });
        setIsLoading(false);
        return;
      }

      setIsEnabled(true);
      setStep("idle");
      setPassword("");
      setVerifyCode("");
      setMessage({ type: "success", text: "2FA enabled successfully" });
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable = async () => {
    setMessage(null);
    setIsLoading(true);

    try {
      const { error } = await authClient.twoFactor.disable({
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to disable 2FA",
        });
      } else {
        setIsEnabled(false);
        setPassword("");
        setBackupCodes([]);
        setMessage({ type: "success", text: "2FA disabled" });
      }
    } catch {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-container">
      <h2 className="text-xl font-bold text-neutral-100 mb-4">
        Two-Factor Authentication
      </h2>
      <p className="text-sm text-neutral-400 mb-4">
        Add an extra layer of security to your account by requiring a code from
        your authenticator app when signing in.
      </p>

      {backupCodes.length > 0 && (
        <div className="mb-4 p-4 bg-neutral-950 rounded-lg border border-amber-700">
          <p className="text-sm font-bold text-amber-500 mb-2">
            Save these backup codes!
          </p>
          <p className="text-xs text-neutral-400 mb-2">
            Use these if you lose access to your authenticator app.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code) => (
              <code key={code} className="text-sm text-neutral-200 font-mono">
                {code}
              </code>
            ))}
          </div>
        </div>
      )}

      {step === "idle" && !isEnabled && (
        <div className="space-y-4">
          <label className="block">
            <span className="form-label">
              Enter your password to enable 2FA
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </label>
          {message && (
            <p
              className={`text-sm ${message.type === "success" ? "text-emerald-500" : "text-red-400"}`}
            >
              {message.text}
            </p>
          )}
          <button
            type="button"
            onClick={handleEnable}
            disabled={isLoading || !password}
            className="btn-primary py-2 px-4"
          >
            {isLoading ? "Setting up..." : "Enable 2FA"}
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="space-y-4">
          <div className="p-4 bg-neutral-950 rounded-lg">
            <p className="text-sm text-neutral-400 mb-2">
              Scan this QR code with your authenticator app, or enter the code
              manually:
            </p>
            <div className="flex justify-center mb-4 bg-white p-4 rounded-lg w-fit mx-auto">
              <QRCodeSVG value={totpUri} size={200} />
            </div>
            <code className="block text-xs text-neutral-500 break-all">
              {totpUri}
            </code>
          </div>
          <label className="block">
            <span className="form-label">
              Enter the 6-digit code from your app
            </span>
            <input
              type="text"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="input-field font-mono text-center text-lg tracking-widest"
            />
          </label>
          {message && (
            <p
              className={`text-sm ${message.type === "success" ? "text-emerald-500" : "text-red-400"}`}
            >
              {message.text}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStep("idle");
                setPassword("");
                setTotpUri("");
                setVerifyCode("");
              }}
              className="btn-secondary py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleVerify}
              disabled={isLoading || verifyCode.length !== 6}
              className="btn-primary py-2 px-4"
            >
              {isLoading ? "Verifying..." : "Verify & Enable"}
            </button>
          </div>
        </div>
      )}

      {step === "idle" && isEnabled && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-bold">2FA is enabled</span>
          </div>
          <label className="block">
            <span className="form-label">
              Enter your password to disable 2FA
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </label>
          {message && (
            <p
              className={`text-sm ${message.type === "success" ? "text-emerald-500" : "text-red-400"}`}
            >
              {message.text}
            </p>
          )}
          <button
            type="button"
            onClick={handleDisable}
            disabled={isLoading || !password}
            className="btn-danger"
          >
            {isLoading ? "Disabling..." : "Disable 2FA"}
          </button>
        </div>
      )}
    </section>
  );
}
