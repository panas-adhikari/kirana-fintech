import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Upload, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";

export default function Step2({ formData, setFormData, nextStep, prevStep }: any) {
  const [businessName, setBusinessName] = useState(formData.businessName || "");
  const [phone, setPhone] = useState(formData.phone || "");
  const [logo, setLogo] = useState(formData.logo || null);
  const [logoPreview, setLogoPreview] = useState(formData.logoPreview || "");
  const [dragActive, setDragActive] = useState(false);
  const [businessNameError, setBusinessNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [logoError, setLogoError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      setLogoError("Only SVG, PNG, JPG, or GIF files are allowed");
      return false;
    }

    if (file.size > maxSize) {
      setLogoError("File size must be less than 2MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setLogo(file);
      setLogoError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLogo(null);
    setLogoPreview("");
    setLogoError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    if (value.trim()) {
      setBusinessNameError("");
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    // Simple phone validation - check if it has at least 10 digits
    if (value.replace(/\D/g, "").length < 10) {
      if (value) setPhoneError("Please enter a valid phone number");
    } else {
      setPhoneError("");
    }
  };

  const handleNext = () => {
    // Validate business name
    if (!businessName.trim()) {
      setBusinessNameError("Business name is required");
      return;
    }

    // Validate phone
    if (!phone.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      setPhoneError("Please enter a valid phone number");
      return;
    }

    setFormData({
      ...formData,
      businessName: businessName,
      phone: phone,
      logo: logo,
      logoPreview: logoPreview,
    });

    nextStep();
  };

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-5">
        <h2 className="text-[22px] font-bold text-gray-900 text-center leading-tight">Setup your Business Profile</h2>
        <p className="text-center text-gray-500 mt-2 text-[13px] px-4">This helps customize your invoices and lets customers know who you are.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Business Legal Name</label>
            <div className="relative">
              <Input
                placeholder="Enter your registered business name"
                value={businessName}
                onChange={(e) => handleBusinessNameChange(e.target.value)}
                className="h-10 bg-gray-50 border-none rounded-xl pr-10 text-sm focus:bg-white transition-all"
              />
              <Store className="absolute right-3 top-3 text-gray-300" size={16} />
            </div>
            {businessNameError && <p className="text-red-500 text-xs mt-1 ml-1">{businessNameError}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Mobile Number</label>
            <div className="flex gap-2">
              <div className="w-24 flex items-center justify-between px-3 bg-gray-50 rounded-xl h-10 text-sm font-medium text-gray-600 border border-transparent cursor-pointer">
                NP +977 <ChevronDown size={10} />
              </div>
              <Input
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="h-10 bg-gray-50 border-none rounded-xl flex-1 text-sm focus:bg-white transition-all"
              />
            </div>
            {phoneError && <p className="text-red-500 text-xs mt-1 ml-1">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 ml-1">Business Logo <span className="font-normal">(Optional)</span></label>
            <div 
              className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                dragActive 
                  ? "border-[#00C805] bg-[#00C805]/5" 
                  : logoPreview 
                  ? "border-gray-100 bg-gray-50/30" 
                  : "border-gray-100 bg-gray-50/30 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleLogoClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/svg+xml,.svg,image/png,.png,image/jpeg,.jpg,.jpeg,image/gif,.gif"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {logoPreview ? (
                <div className="relative w-full h-32 flex items-center justify-center">
                  <img src={logoPreview} alt="Logo preview" className="max-h-32 max-w-full object-contain" />
                  <button
                    onClick={removeLogo}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <span className="text-lg leading-none">×</span>
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={20} className="text-gray-300 mb-2" />
                  <p className="text-xs font-bold text-[#00C805]">Click to upload <span className="text-gray-600 font-medium">or drag and drop</span></p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </>
              )}
            </div>
            {logoError && <p className="text-red-500 text-xs mt-1 ml-1">{logoError}</p>}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <Button variant="outline" onClick={prevStep} className="h-10 px-4 border-gray-200 rounded-xl text-gray-500 font-bold flex gap-1 items-center text-sm">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!businessName.trim() || !phone.trim() || !!businessNameError || !!phoneError}
          className="h-10 flex-1 bg-[#00C805] hover:bg-[#00b304] rounded-xl text-sm font-bold flex gap-2 shadow-md shadow-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
