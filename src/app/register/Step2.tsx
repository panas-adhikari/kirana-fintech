import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Store, Upload, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";

export default function Step2({ formData, setFormData, nextStep, prevStep }: any) {
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
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="h-10 bg-gray-50 border-none rounded-xl pr-10 text-sm focus:bg-white transition-all"
              />
              <Store className="absolute right-3 top-3 text-gray-300" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-900 mb-1.5 ml-1">Mobile Number</label>
            <div className="flex gap-2">
              <div className="w-24 flex items-center justify-between px-3 bg-gray-50 rounded-xl h-10 text-sm font-medium text-gray-600 border border-transparent cursor-pointer">
                NP +977 <ChevronDown size={10} />
              </div>
              <Input
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-10 bg-gray-50 border-none rounded-xl flex-1 text-sm focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1.5 ml-1">Business Logo <span className="font-normal">(Optional)</span></label>
            <div className="border-2 border-dashed border-gray-100 rounded-2xl p-5 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload size={20} className="text-gray-300 mb-2" />
              <p className="text-xs font-bold text-[#00C805]">Click to upload <span className="text-gray-600 font-medium">or drag and drop</span></p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">SVG, PNG, JPG or GIF (max. 2MB)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 flex gap-3">
        <Button variant="outline" onClick={prevStep} className="h-10 px-4 border-gray-200 rounded-xl text-gray-500 font-bold flex gap-1 items-center text-sm">
          <ArrowLeft size={16} /> Back
        </Button>
        <Button onClick={nextStep} className="h-10 flex-1 bg-[#00C805] hover:bg-[#00b304] rounded-xl text-sm font-bold flex gap-2 shadow-md shadow-green-100">
          Next Step <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}