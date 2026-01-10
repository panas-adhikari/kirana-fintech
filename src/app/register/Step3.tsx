import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, CheckCircle2, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { registerPasswordValidator } from "@/utils/inputValidator";

export default function Step3({ formData, setFormData, prevStep, submit }: any) {
  const [password, setPassword] = useState(formData.password || "");
  const [confirmPassword, setConfirmPassword] = useState(formData.confirmPassword || "");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // Validate on change
    const result = registerPasswordValidator(value);
    setPasswordError(result.error ? result.message : "");
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);

    // Check if passwords match
    if (value && password && value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const isPasswordValid = !registerPasswordValidator(password).error && password === confirmPassword && confirmPassword !== "";

  const handleSubmit = () => {
    // Final validation
    const passwordValidation = registerPasswordValidator(password);

    if (passwordValidation.error) {
      setPasswordError(passwordValidation.message);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
      return;
    }

    const finalData = {
      ...formData,
      password: password,
      confirmPassword: confirmPassword,
    };

    setFormData(finalData);

    submit(finalData);
  };

  // Calculate password strength based on criteria met
  const passwordStrength = useMemo(() => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    return strength;
  }, [password]);

  // Get strength label and color
  const getStrengthInfo = (strength: number) => {
    if (strength <= 1) return { label: "Weak", color: "text-red-500", bgColor: "bg-red-500" };
    if (strength <= 2) return { label: "Fair", color: "text-orange-500", bgColor: "bg-orange-500" };
    if (strength <= 3) return { label: "Good", color: "text-yellow-500", bgColor: "bg-yellow-500" };
    if (strength <= 4) return { label: "Strong", color: "text-[#00C805]", bgColor: "bg-[#00C805]" };
    return { label: "Very Strong", color: "text-green-700", bgColor: "bg-green-700" };
  };

  const strengthInfo = getStrengthInfo(passwordStrength);

  // Validate password requirements
  const requirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { label: "At least one number", met: /\d/.test(password) },
    { label: "At least one special character (@$!%*?&)", met: /[@$!%*?&]/.test(password) },
  ];

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-6">
        <h2 className="text-[22px] font-bold text-gray-900 text-center leading-tight">Set Your Password</h2>
        <p className="text-center text-gray-500 mt-2 text-[13px] px-4">Secure your account to start managing your finances.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-green-700/40" size={16} />
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="h-10 bg-gray-50 border-none rounded-xl pl-10 pr-10 text-sm focus:bg-white transition-all"
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-300">
                <Eye size={16} />
              </button>
            </div>
            {/* Strength Meter */}
            <div className="flex gap-1 mt-2 px-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthInfo.bgColor : 'bg-gray-100'
                  }`} />
              ))}
            </div>
            <p className={`text-[10px] mt-1 font-medium px-1 ${strengthInfo.color}`}>Strength: <span className="font-bold">{strengthInfo.label}</span></p>
            {passwordError && <p className="text-red-500 text-xs mt-1 ml-1">{passwordError}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400"><Lock size={16} /></div>
              <Input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                className="h-10 bg-gray-50 border-none rounded-xl pl-10 pr-10 text-sm focus:bg-white transition-all"
              />
              <button onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-3 text-gray-300">
                <Eye size={16} />
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-xs mt-1 ml-1">{confirmPasswordError}</p>}
          </div>

          <div className="bg-[#F6FFF6] border border-[#E8F5E8] rounded-xl p-4 space-y-2">
            <p className="text-[11px] font-bold text-gray-900 mb-1">Password must contain:</p>
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[12px]">
                {req.met ? (
                  <CheckCircle2 size={14} className="text-[#00C805] fill-[#00C805] text-white" />
                ) : (
                  <Circle size={14} className="text-gray-300" />
                )}
                <span className={req.met ? "text-[#00C805] font-semibold" : "text-gray-400"}>{req.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <Button variant="outline" onClick={prevStep} className="h-10 px-4 border-gray-200 rounded-xl text-gray-500 font-bold flex gap-1 items-center text-sm">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!isPasswordValid || !!passwordError || !!confirmPasswordError}
          className="h-10 flex-1 bg-[#00C805] hover:bg-[#00b304] rounded-xl text-sm font-bold flex gap-2 shadow-md shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}