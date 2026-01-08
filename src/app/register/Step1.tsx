import React from "react";
import {useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {registerEmailValidator} from "@/utils/inputValidator";


export default function Step1({ formData, setFormData, nextStep }: any) {
  const [fullName , setFullName] = useState("");
  const [email , setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");

  const handleNameChange = (value: string) => {
    setFullName(value);
    setNameError("");
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    const result = registerEmailValidator(value);
    setEmailError(result.error ? result.message : "");
  };

  const handleNext = () => {
    // Validate name
    if (!fullName.trim()) {
      setNameError("Full name is required");
      return;
    }

    // Validate email
    const result = registerEmailValidator(email);

    if (result.error) {
      setEmailError(result.message);
      return;
    }

    setFormData({
      ...formData,
      name: fullName,
      email: email,
    });

    nextStep();
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-[22px] font-bold text-gray-900 text-center leading-tight">Create your account</h2>
        <p className="text-center text-gray-500 mt-2 text-[13px] px-4">Enter your personal details to get started with your bookkeeping.</p>

        <Button variant="outline" className="w-full mt-6 h-10 rounded-xl border-gray-200 text-sm font-semibold flex gap-3">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg
" className="w-4 h-4" alt="Google" />
          Sign up with Google
        </Button>

        <div className="relative my-6 flex items-center">
          <div className="flex-grow border-t-2 border-gray-100"></div>
          <span className="px-3 text-[10px] font-[500] text-[#3a7046] uppercase tracking-widest">Or sign up with email</span>
          <div className="flex-grow border-t-2 border-gray-100"></div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Full Name</label>
            <Input
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={({ target }) => handleNameChange(target.value)}
              className="h-10 bg-gray-50 border-none rounded-xl px-4 text-sm focus:bg-white transition-all"
            />
            {nameError && <p className="text-red-500 text-xs mt-1 ml-1">{nameError}</p>}
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Email / Gmail</label>
            <Input
              placeholder="e.g. john@gmail.com"
              value={email}
              onChange={({ target }) => handleEmailChange(target.value)}
              className="h-10 bg-gray-50 border-none rounded-xl px-4 text-sm focus:bg-white transition-all"
            />
            {emailError && <p className="text-red-500 text-xs mt-1 ml-1">{emailError}</p>}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6">
        <Button 
          className="w-full h-10 bg-[#00C805] hover:bg-[#00b304] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-green-100"
          onClick={handleNext}
          disabled={!fullName.trim() || !email || !!emailError || !!nameError}
        >
          Next Step <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}