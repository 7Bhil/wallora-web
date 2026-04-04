import React from 'react';
import { Smartphone, Download as DownloadIcon, ShieldCheck, Zap } from 'lucide-react';

export default function Download() {
  const APK_URL = "https://expo.dev/artifacts/eas/34yQfHroRtBEvQrRCYtrYX.apk";

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 mb-6 text-purple-400">
          <Smartphone size={32} />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4 uppercase tracking-[0.05em]">Wallora Mobile</h1>
        <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
          Take the Arena anywhere. Vote, upload, and rank wallpapers directly from your Android device.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Main Download Card */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Stable Version</span>
            <h3 className="text-2xl font-bold text-white mt-1">Android APK</h3>
          </div>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Download the official Wallora application for the best mobile experience. Optimized for high-res displays.
          </p>
          <a 
            href={APK_URL}
            className="w-full py-4 rounded-2xl bg-white text-[#0d0914] font-black flex items-center justify-center gap-3 hover:bg-purple-400 transition transform hover:scale-[1.02] shadow-xl"
          >
            <DownloadIcon size={20} />
            DOWNLOAD APK
          </a>
          <p className="mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">Version 1.0.0 (Latest)</p>
        </div>

        {/* Feature Highlights */}
        <div className="flex flex-col gap-4">
          {[
            { icon: Zap, title: "Optimized Speed", desc: "Experience the fastest voting system with zero lag." },
            { icon: ShieldCheck, title: "Verified Secure", desc: "Built with Expo and EAS for a secure native environment." },
            { icon: Smartphone, title: "Native UI", desc: "Designed specifically for modern Android gesture navigation." }
          ].map((f, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex items-center gap-5 hover:bg-white/[0.04] transition">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-white transition">
                <f.icon size={20} />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-0.5">{f.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Installation Guide */}
      <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-3xl p-8">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <HelpCircle size={18} className="text-gray-500" />
          How to install?
        </h4>
        <ul className="space-y-3 text-xs text-gray-500 font-medium">
          <li className="flex gap-3">
            <span className="text-purple-500 font-black">1.</span>
            <span>Download the APK file above on your mobile phone.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-purple-500 font-black">2.</span>
            <span>If prompted, allow your browser to "Install apps from unknown sources".</span>
          </li>
          <li className="flex gap-3">
            <span className="text-purple-500 font-black">3.</span>
            <span>Open the downloaded file and tap "Install".</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

const HelpCircle = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
