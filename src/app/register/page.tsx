'use client';
import React, { useState } from "react";
import Link from "next/link";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { Button } from "@/components/ui/button";

const STEPS = [{ label: "Personal Info" }, { label: "Business Details" }, { label: "Final Step" }];

export default function SignupWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", businessName: "", phone: "", password: "", confirmPassword: "",
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-brand-primary transition-colors">
            <span className="text-2xl font-bold tracking-tight">KiranaFinTech<span className="text-emerald-500">_KIT</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">Already have an account?</span>
          <Link href="/login" className="text-[#00C805] font-bold text-sm hover:text-[#00b304] hover:bg-green-50 hover:rounded-md p-1.5">Log In</Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">

          {/* Progress Bar Area */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-[500] uppercase tracking-wider">Step {step} of 3</span>
              <span className="text-[12px] font-[500] text-[#3a7046] capitalize tracking-wider">{STEPS[step - 1].label}</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#00C805] h-full transition-all duration-500 ease-in-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="min-h-[380px] flex flex-col">
            {step === 1 && <Step1 formData={formData} setFormData={setFormData} nextStep={() => setStep(2)} />}
            {step === 2 && <Step2 formData={formData} setFormData={setFormData} nextStep={() => setStep(3)} prevStep={() => setStep(1)} />}
            {step === 3 && <Step3 formData={formData} setFormData={setFormData} prevStep={() => setStep(2)} submit={(data: any) => {
              const { confirmPassword, logoPreview, ...filteredData } = data;
              console.log("=== Signup Data Gathered ===");
              console.log(filteredData);
              console.log("============================");
            }} />}
          </div>

          {/* Inner Footer Policy*/}
          <div className="mt-6 pt-4 border-t border-gray-50 text-center">
            <p className="text-[11px] text-gray-400 leading-tight">
              {step === 3 && "By clicking \"Create Account\", "}By continuing, you agree to our{" "}
              <a href="#" className="text-gray-900 font-bold hover:underline">Terms of Service</a> and{" "}
              <a href="#" className="text-gray-900 font-bold hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Outer Footer Elements */}
        <div className="mt-8 text-center space-y-4">
          {step === 2 && (
            <p className="text-sm text-gray-400 font-medium">
              Need help setting up? <a href="#" className="text-[#00C805] font-bold">Contact Support</a>
            </p>
          )}
          {step === 3 && (
            <div className="flex gap-6 justify-center text-gray-400 text-[11px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[8px]">✓</div>
                Bank-grade Security
              </div>
              <div className="flex items-center gap-1.5 opacity-60">
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[8px]">🛡</div>
                256-bit Encryption
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}