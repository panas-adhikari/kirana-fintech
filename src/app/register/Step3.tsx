import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Eye, CheckCircle2, Circle, ArrowRight, ArrowLeft } from "lucide-react";

export default function Step3({ formData, setFormData, prevStep, submit }: any) {
  const [showPass, setShowPass] = useState(false);
  const requirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "A mix of letters and numbers", met: /[a-zA-Z]/.test(formData.password) && /\d/.test(formData.password) },
    { label: "At least one special symbol (e.g. !@#$)", met: /[!@#$%^&*]/.test(formData.password) },
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-10 bg-gray-50 border-none rounded-xl pl-10 pr-10 text-sm focus:bg-white transition-all"
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-300">
                <Eye size={16} />
              </button>
            </div>
            {/* Strength Meter */}
            <div className="flex gap-1 mt-2 px-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= 2 ? 'bg-[#00C805]' : 'bg-gray-100'}`} />
              ))}
            </div>
            <p className="text-[10px] mt-1 text-gray-400 font-medium px-1">Strength: <span className="text-[#00C805] font-bold">Medium</span></p>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-gray-400"><Lock size={16}/></div>
              <Input
               type={showPass ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-10 bg-gray-50 border-none rounded-xl pl-10 pr-10 text-sm focus:bg-white transition-all"
              />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-300">
                <Eye size={16} />
              </button>
            </div>
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
        <Button onClick={submit} className="h-10 flex-1 bg-[#00C805] hover:bg-[#00b304] rounded-xl text-sm font-bold flex gap-2 shadow-md shadow-green-100">
          Create Account <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}